-- ============================================================================
-- Bandcamp Album of the Day - analytics views
-- ============================================================================
--
-- These are the semantic layer. Tableau, the web app and the notebooks all
-- read from here rather than from fact_article directly, which means a metric
-- is defined exactly once: change "indie share" here and every surface moves
-- together.
--
-- Apply with:  psql "$DATABASE_URL" -f db/views.sql
-- ============================================================================

SET search_path TO bandcamp, public;


-- ----------------------------------------------------------------------------
-- vw_article - the denormalised base view everything else builds on
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_article AS
SELECT
    f.article_id,
    f.article_url,
    f.published_date,
    f.year,
    f.quarter,
    f.month,
    f.month_name,
    f.iso_week,
    f.day_of_week,
    f.day_of_week_num,
    a.author_name              AS author,
    f.title,
    f.genre_tag,
    f.artist,
    f.album,
    l.label_name               AS record_label,
    COALESCE(f.is_independent, FALSE) AS is_independent,
    p.location_clean,
    p.city,
    p.state,
    p.country,
    p.latitude,
    p.longitude,
    f.spotify_url,
    f.spotify_image_url,
    f.spotify_artist_url,
    f.spotify_artist_image_url,
    f.spotify_release_date,
    f.spotify_album_type,
    f.spotify_total_tracks,
    (f.spotify_match_status = 'matched') AS has_spotify_match
FROM fact_article f
LEFT JOIN dim_author a ON a.author_id = f.author_id
LEFT JOIN dim_label  l ON l.label_id  = f.label_id
LEFT JOIN dim_place  p ON p.place_id  = f.place_id;


-- ----------------------------------------------------------------------------
-- vw_coverage_by_country - the choropleth source
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_coverage_by_country AS
SELECT
    country,
    COUNT(*)                                        AS features,
    COUNT(DISTINCT artist)                          AS distinct_artists,
    COUNT(DISTINCT record_label)                    AS distinct_labels,
    COUNT(DISTINCT genre_tag)                       AS distinct_genres,
    ROUND(AVG(is_independent::int)::numeric, 4)     AS indie_share,
    MIN(published_date)                             AS first_feature,
    MAX(published_date)                             AS latest_feature,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS pct_of_all_features
FROM vw_article
WHERE country IS NOT NULL
GROUP BY country;


-- ----------------------------------------------------------------------------
-- vw_city_genre_specialisation - "is Bristol still the trip-hop city?"
-- ----------------------------------------------------------------------------
-- Lift compares a genre's share within one city against that genre's share
-- across the whole archive. Lift > 1 means the city over-indexes on that
-- sound.
--
-- Lift is extremely noisy in the tail: a city with 12 features and a single
-- "Kids" record scores a lift of 66 and tops any unfiltered ranking, which
-- means nothing. Two floors keep the output honest - the city needs at least
-- 10 *tagged* features overall, and the city/genre pair needs at least 3. The
-- raw counts are kept in the view so a reader can judge the evidence
-- themselves rather than taking the ratio on trust.
--
-- The grain is city + state + country, not city + country: Portland, Oregon
-- and Portland, Maine are different scenes, and so are Richmond, Virginia and
-- Richmond, California. Carrying ``state`` through also lets Tableau's
-- geocoder place US cities unambiguously instead of flagging "Portland" as
-- unknown. It sits last in the column list because CREATE OR REPLACE VIEW can
-- append columns but never reorder them.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_city_genre_specialisation AS
WITH city_totals AS (
    SELECT city, state, country, COUNT(*) AS city_features
    FROM vw_article
    WHERE city IS NOT NULL AND genre_tag IS NOT NULL
    GROUP BY city, state, country
    HAVING COUNT(*) >= 10
),
genre_totals AS (
    SELECT genre_tag,
           COUNT(*)::numeric / SUM(COUNT(*)) OVER () AS global_share
    FROM vw_article
    WHERE genre_tag IS NOT NULL
    GROUP BY genre_tag
),
city_genre AS (
    SELECT a.city, a.state, a.country, a.genre_tag, COUNT(*) AS features
    FROM vw_article a
    WHERE a.city IS NOT NULL AND a.genre_tag IS NOT NULL
    GROUP BY a.city, a.state, a.country, a.genre_tag
)
SELECT
    cg.city,
    cg.country,
    cg.genre_tag,
    cg.features,
    ct.city_features,
    ROUND((cg.features::numeric / ct.city_features), 4)          AS city_share,
    ROUND(gt.global_share, 4)                                    AS global_share,
    ROUND((cg.features::numeric / ct.city_features) / NULLIF(gt.global_share, 0), 2) AS lift,
    cg.state
FROM city_genre cg
JOIN city_totals  ct ON ct.city = cg.city
                    AND ct.state   IS NOT DISTINCT FROM cg.state
                    AND ct.country IS NOT DISTINCT FROM cg.country
JOIN genre_totals gt ON gt.genre_tag = cg.genre_tag
WHERE cg.features >= 3;


-- ----------------------------------------------------------------------------
-- vw_author_profile - editorial coverage per contributor
-- ----------------------------------------------------------------------------
-- Shannon entropy in bits: how spread out a writer's genre coverage is. A
-- specialist who only covers metal scores near 0; a generalist scores high.
-- Computed in SQL so the dashboard doesn't need Python to show it.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_author_profile AS
WITH author_genre AS (
    SELECT author, genre_tag, COUNT(*)::numeric AS n
    FROM vw_article
    WHERE author IS NOT NULL AND genre_tag IS NOT NULL
    GROUP BY author, genre_tag
),
genre_shares AS (
    SELECT author, n / SUM(n) OVER (PARTITION BY author) AS p
    FROM author_genre
),
entropy_rollup AS (
    SELECT author, ROUND(-SUM(p * LOG(2::numeric, p)), 3) AS genre_entropy_bits
    FROM genre_shares
    GROUP BY author
)
SELECT
    a.author,
    COUNT(*)                                    AS reviews,
    COUNT(DISTINCT a.genre_tag)                 AS distinct_genres,
    COUNT(DISTINCT a.country)                   AS distinct_countries,
    ROUND(AVG(a.is_independent::int)::numeric, 4) AS indie_share,
    MIN(a.published_date)                       AS first_review,
    MAX(a.published_date)                       AS latest_review,
    (MAX(a.published_date) - MIN(a.published_date)) AS active_days,
    e.genre_entropy_bits
FROM vw_article a
LEFT JOIN entropy_rollup e ON e.author = a.author
WHERE a.author IS NOT NULL
GROUP BY a.author, e.genre_entropy_bits;


-- ----------------------------------------------------------------------------
-- vw_genre_trend - genre share by year, for the streamgraph
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_genre_trend AS
SELECT
    year,
    genre_tag,
    COUNT(*) AS features,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY year), 2) AS pct_of_year,
    RANK() OVER (PARTITION BY year ORDER BY COUNT(*) DESC) AS rank_in_year
FROM vw_article
WHERE genre_tag IS NOT NULL AND year IS NOT NULL
GROUP BY year, genre_tag;


-- ----------------------------------------------------------------------------
-- vw_label_leaderboard - which labels the editors keep coming back to
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_label_leaderboard AS
SELECT
    record_label,
    COUNT(*)                     AS features,
    COUNT(DISTINCT artist)       AS distinct_artists,
    COUNT(DISTINCT author)       AS distinct_authors,
    MODE() WITHIN GROUP (ORDER BY genre_tag) AS primary_genre,
    MODE() WITHIN GROUP (ORDER BY country)   AS primary_country,
    MIN(published_date)          AS first_feature,
    MAX(published_date)          AS latest_feature
FROM vw_article
WHERE record_label IS NOT NULL AND NOT is_independent
GROUP BY record_label;


-- ----------------------------------------------------------------------------
-- vw_latest_features - the web app's front page
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_latest_features AS
SELECT
    article_id, published_date, artist, album, genre_tag,
    record_label, is_independent, city, country,
    article_url, spotify_url, spotify_image_url, author
FROM vw_article
ORDER BY published_date DESC
LIMIT 100;


-- ----------------------------------------------------------------------------
-- vw_pipeline_health - freshness, for the "data as of" badge
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_pipeline_health AS
SELECT
    (SELECT COUNT(*)             FROM fact_article)                  AS total_articles,
    (SELECT MAX(published_date)  FROM fact_article)                  AS latest_article_date,
    (SELECT MAX(updated_at)      FROM fact_article)                  AS last_load_at,
    (SELECT ROUND(100.0 * AVG((spotify_match_status = 'matched')::int), 1)
       FROM fact_article)                                            AS spotify_match_rate,
    (SELECT ROUND(100.0 * AVG((place_id IS NOT NULL)::int), 1)
       FROM fact_article)                                            AS location_coverage_rate,
    (SELECT status FROM pipeline_run ORDER BY started_at DESC LIMIT 1) AS last_run_status,
    (SELECT started_at FROM pipeline_run ORDER BY started_at DESC LIMIT 1) AS last_run_at;
