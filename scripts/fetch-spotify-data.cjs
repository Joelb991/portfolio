#!/usr/bin/env node
/**
 * Fetches real playlist tracks from Spotify using the embed page's
 * internal access token. No developer credentials needed.
 *
 * Pulls: track name, artist, album art, popularity (0-100),
 *        release date, added_at timestamp, decade.
 *
 * Falls back to Deezer API for popularity when Spotify API is rate limited.
 *
 * Usage:
 *   node scripts/fetch-spotify-data.cjs
 *   node scripts/fetch-spotify-data.cjs <playlist_id>
 */

const fs = require("fs");
const path = require("path");

const PLAYLIST_ID = process.argv[2] || "0yYaUe9wrhaFz63L5N9Mce";
const OUT_FILE = path.join(__dirname, "..", "src", "data", "playlistTracks.js");

// ── Genre colors ────────────────────────────────────────────────────────────
const GENRE_COLOR_PRESETS = {
  "Classic Rock": "#e8a838",
  "Indie":        "#7495a1",
  "Folk":         "#5aaa7a",
  "Film Score":   "#4a9eda",
  "R&B":          "#a85ae8",
  "Jazz":         "#e8c83a",
  "Pop":          "#e85a8a",
  "Electronic":   "#5ae8c9",
  "Hip Hop":      "#e86a3a",
  "Punk":         "#e84a4a",
  "Reggae":       "#3aa85a",
  "Blues":        "#4a6ae8",
  "Other":        "#888888",
};

// ── Genre mapping by artist name ───────────────────────────────────────────
function mapGenreByArtist(name) {
  const n = name.toLowerCase();
  if (/zimmer|williams|giacchino|desplat|morricone|howard shore|elfman|newman/.test(n)) return "Film Score";
  if (/billie holiday|nina simone|coltrane|miles davis|monk|ella fitzgerald|duke ellington|charlie parker|bill evans|herbie hancock|lelio luttazzi/.test(n)) return "Jazz";
  if (/marvin gaye|barbara mason|sly.*family|bobby oroza|cold diamond|equatics|stevie wonder|aretha|amy winehouse|erykah badu|al green|otis redding|curtis mayfield|isley|kelis|chingy|tyrese|leroy smart|papa bear|bobby hebb/.test(n)) return "R&B";
  if (/bon iver|nick drake|iron.*wine|fleet foxes|sufjan|elliott smith|tracy chapman|nilsson|vance joy|simon.*garfunkel|joni mitchell|cat stevens|james taylor|glen campbell|bob dylan|labi siffre|fly golden eagle|mei ehara/.test(n)) return "Folk";
  if (/beach house|wilco|pixies|smashing pumpkins|replacements|twin peaks|starflyer|tame impala|radiohead|strokes|grizzly bear|arctic monkeys|the 1975|vampire weekend|mac demarco|skin mag|class fools|nice guys|dumbo|alan chang|don luxe|eartheater|ogre you asshole|leah dou|pinback|fake laugh|failure|the stone roses|tennis|the undercover dream lovers|male tears|good morning|babebee|deftones|richard swift/.test(n)) return "Indie";
  if (/beatles|mccartney|lennon|harrison|wings|queen|led zeppelin|eagles|the who|pink floyd|rolling stones|fleetwood|hendrix|cream|doors|aerosmith|elton john|steely dan|ambrosia|billy idol|ac\/dc|deep purple|black sabbath|clapton|stevie ray|tom petty|springsteen|billy joel/.test(n)) return "Classic Rock";
  if (/kendrick|drake|kanye|j\. cole|tyler|childish gambino|chance|kid cudi|mac miller|a\$ap|travis scott/.test(n)) return "Hip Hop";
  if (/djibouti|daft punk|aphex|four tet|jamie xx|disclosure|flume|odesza|bonobo|tycho|lcd soundsystem|holden|blue hawaii/.test(n)) return "Electronic";
  if (/taylor swift|ariana|bruno mars|ed sheeran|adele|olivia rodrigo|harry styles|dua lipa|billie eilish|lorde|gianluca|lily allen|george michael|robbie dupree/.test(n)) return "Pop";
  if (/pierce the veil|my chemical romance|paramore|fall out boy|panic.*disco|bring me the horizon/.test(n)) return "Punk";
  return "Other";
}

function getDecade(releaseDate) {
  if (!releaseDate) return "Unknown";
  const year = parseInt(releaseDate.slice(0, 4), 10);
  return `${Math.floor(year / 10) * 10}s`;
}

// ── Spotify API with retry ──────────────────────────────────────────────────
async function spotifyGet(token, url) {
  const fullUrl = url.startsWith("http") ? url : `https://api.spotify.com/v1${url}`;
  const res = await fetch(fullUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 429) {
    const wait = parseInt(res.headers.get("retry-after") || "5", 10);
    if (wait > 60) {
      console.log(`  Rate limited for ${wait}s — skipping API, will use fallbacks`);
      return null; // Signal to use fallbacks
    }
    console.log(`  Rate limited — waiting ${wait}s...`);
    await new Promise(r => setTimeout(r, wait * 1000));
    return spotifyGet(token, url);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

// ── Extract embed token ─────────────────────────────────────────────────────
async function getEmbedToken() {
  console.log("Fetching Spotify embed token...");
  const res = await fetch(`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`Embed page returned ${res.status}`);
  const html = await res.text();
  const match = html.match(/accessToken["']?\s*[:=]\s*["']([^"']+)["']/);
  if (!match) throw new Error("Could not find access token in embed page");
  console.log("  Token extracted");
  return match[1];
}

// ── Get track data from embed pages ─────────────────────────────────────────
async function getTrackFromEmbed(trackId) {
  const res = await fetch(`https://open.spotify.com/embed/track/${trackId}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const nd = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  if (!nd) return null;
  const data = JSON.parse(nd[1]);
  return data.props?.pageProps?.state?.data?.entity || null;
}

// ── Get playlist tracks from embed page ─────────────────────────────────────
async function getPlaylistFromEmbed() {
  console.log("Fetching playlist from embed page...");
  const res = await fetch(`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });
  if (!res.ok) throw new Error(`Embed page returned ${res.status}`);
  const html = await res.text();
  const nd = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
  if (!nd) throw new Error("No __NEXT_DATA__ in embed page");
  const data = JSON.parse(nd[1]);
  const entity = data.props?.pageProps?.state?.data?.entity;
  if (!entity?.trackList) throw new Error("No track list in embed data");
  console.log(`  "${entity.name}" — ${entity.trackList.length} tracks`);
  return entity;
}

// ── Deezer fallback for popularity ──────────────────────────────────────────
async function getDeezerPopularity(trackName, artistName) {
  const q = encodeURIComponent(`${trackName} ${artistName}`);
  const res = await fetch(`https://api.deezer.com/search?q=${q}&limit=1`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.[0]?.rank || null;
}

function normalizeRanks(ranks) {
  const values = Object.values(ranks).filter(Boolean);
  if (values.length === 0) return {};
  const logMin = Math.log(Math.min(...values));
  const logMax = Math.log(Math.max(...values));
  const range = logMax - logMin || 1;
  const result = {};
  for (const [key, rank] of Object.entries(ranks)) {
    result[key] = rank ? Math.round(((Math.log(rank) - logMin) / range) * 100) : 30;
  }
  return result;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const token = await getEmbedToken();
  await new Promise(r => setTimeout(r, 1000));

  // 1. Try Spotify API first
  console.log(`\nFetching playlist ${PLAYLIST_ID}...`);
  const playlist = await spotifyGet(token, `/playlists/${PLAYLIST_ID}`);

  let apiTracks = null;
  if (playlist && playlist.tracks?.items) {
    // API works — use it for full data (popularity, addedAt)
    let allItems = [];
    let page = playlist.tracks;
    while (page) {
      allItems.push(...page.items);
      if (page.next) {
        console.log(`  ${allItems.length} / ${page.total}...`);
        await new Promise(r => setTimeout(r, 300));
        page = await spotifyGet(token, page.next);
        if (!page) break;
      } else {
        page = null;
      }
    }
    console.log(`  ${allItems.length} tracks from API`);
    apiTracks = allItems;
  } else {
    console.log("  API unavailable — using embed + Deezer fallback");
  }

  // 2. Get track list from embed page (always works)
  const embedPlaylist = await getPlaylistFromEmbed();
  const trackList = embedPlaylist.trackList;

  // 3. Fetch individual track embeds for album art + release dates
  console.log("\nFetching track details from embed pages...");
  const embedDetails = {};
  for (let i = 0; i < trackList.length; i++) {
    const id = trackList[i].uri.split(":")[2];
    const title = trackList[i].title;
    try {
      const entity = await getTrackFromEmbed(id);
      if (entity) {
        const images = entity.visualIdentity?.image || [];
        const art = images.find(img => img.maxWidth === 64)?.url || images[0]?.url || null;
        const releaseDate = entity.releaseDate?.isoString?.slice(0, 10) || null;
        embedDetails[title] = { albumArt: art, releaseDate };
      }
      console.log(`  [${i + 1}/${trackList.length}] ${title}`);
    } catch (e) {
      console.log(`  [${i + 1}/${trackList.length}] ${title}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  // 4. If no API data, get popularity from Deezer
  let deezerPop = {};
  if (!apiTracks) {
    console.log("\nFetching popularity from Deezer...");
    const rawRanks = {};
    for (let i = 0; i < trackList.length; i++) {
      const title = trackList[i].title;
      const artist = trackList[i].subtitle.split(",")[0].trim();
      const rank = await getDeezerPopularity(title, artist);
      rawRanks[title] = rank;
      console.log(`  [${i + 1}/${trackList.length}] ${title}: ${rank || "not found"}`);
      await new Promise(r => setTimeout(r, 250));
    }
    deezerPop = normalizeRanks(rawRanks);
  }

  // 5. Build output
  const outputTracks = [];
  const genresUsed = new Set();

  for (let i = 0; i < trackList.length; i++) {
    const tl = trackList[i];
    const artistName = tl.subtitle;
    const genre = mapGenreByArtist(artistName);
    genresUsed.add(genre);

    const embed = embedDetails[tl.title] || {};
    const releaseDate = embed.releaseDate || null;

    let popularity, addedAt, albumArt;

    if (apiTracks && apiTracks[i]?.track) {
      // Use API data
      const at = apiTracks[i].track;
      popularity = at.popularity ?? 0;
      addedAt = apiTracks[i].added_at || null;
      albumArt = embed.albumArt || at.album?.images?.[at.album.images.length - 1]?.url || null;
    } else {
      // Use embed + Deezer fallback
      popularity = deezerPop[tl.title] ?? 30;
      addedAt = null;
      albumArt = embed.albumArt || null;
    }

    outputTracks.push({
      name: tl.title,
      artist: artistName,
      genre,
      popularity,
      releaseDate,
      decade: getDecade(releaseDate),
      addedAt,
      albumArt,
    });
  }

  // 6. Genre colors
  const genreColors = {};
  for (const g of [...genresUsed].sort()) {
    genreColors[g] = GENRE_COLOR_PRESETS[g] || generateColor(g);
  }

  // 7. Write file
  const source = apiTracks ? "Spotify API" : "Spotify embeds + Deezer";
  const fileContent = `
// Auto-generated from Spotify playlist "${embedPlaylist.name}" (${PLAYLIST_ID})
// Run: node scripts/fetch-spotify-data.cjs
// Last updated: ${new Date().toISOString().split("T")[0]}
// Popularity source: ${source}

export const genreColors = ${JSON.stringify(genreColors, null, 2)};

export const playlistTracks = ${JSON.stringify(outputTracks, null, 2)};
`;

  fs.writeFileSync(OUT_FILE, fileContent, "utf-8");
  console.log(`\nWrote ${outputTracks.length} tracks to ${path.relative(process.cwd(), OUT_FILE)}`);
  console.log(`Genres: ${[...genresUsed].sort().join(", ")}`);
  console.log(`Data source: ${source}`);

  // Stats preview
  const pops = outputTracks.map(t => t.popularity);
  const avgPop = Math.round(pops.reduce((a, b) => a + b, 0) / pops.length);
  const decades = {};
  for (const t of outputTracks) decades[t.decade] = (decades[t.decade] || 0) + 1;
  console.log(`\nStats:`);
  console.log(`  Avg popularity: ${avgPop}/100`);
  console.log(`  Decades: ${Object.entries(decades).sort().map(([d, n]) => `${d}(${n})`).join(", ")}`);
  console.log(`  Album art: ${outputTracks.filter(t => t.albumArt).length}/${outputTracks.length}`);
  console.log(`  Has addedAt: ${outputTracks.filter(t => t.addedAt).length}/${outputTracks.length}`);
  console.log("\nDone!");
}

function generateColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 55%)`;
}

main().catch(err => {
  console.error("\nError:", err.message);
  process.exit(1);
});
