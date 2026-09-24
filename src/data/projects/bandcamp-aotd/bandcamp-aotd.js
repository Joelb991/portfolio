const P = (slug) => `/projects/${slug}`;
const SLUG = "bandcamp-aotd";

// Synced from the project repo by scripts/sync-assets.cjs
import viewsSql from "./code/views.sql?raw";
import identityPy from "./code/identity.py?raw";

const REPO = "https://github.com/Joelb991/Bandcamp_Album-of-the-Day";
const APP_URL = "https://bandcamp-aotd.vercel.app"; // the Vercel production URL of the app in the repo's app/ folder

export default {
  title: "Bandcamp Album of the Day Analytics",
  slug: SLUG,
  desc: "End-to-end analytics on 15 years of Bandcamp Daily: a Python pipeline into a Postgres warehouse, a SQL semantic layer, a Tableau dashboard and a live Next.js app.",
  tags: ["Python", "SQL", "Tableau", "Next.js"],
  cover: "/images/projects/bandcamp_cover.jpg", // the app's coverage map, cropped: reads cleanly behind the hero title
  icon: "\u{1F4BF}",
  categories: ["Python", "SQL", "Tableau", "Web Scraping", "Data Cleaning", "EDA", "Entertainment"],
  links: [
    { label: "Live App", type: "external", url: APP_URL },
    { label: "Tableau", type: "external", url: "https://public.tableau.com/views/bandcamp_aotd/Coverage" },
    { label: "GitHub", type: "github", url: REPO },
  ],
  detail: {
    subtitle: "Personal Project — End-to-End Analytics",
    overview: "Bandcamp Daily has picked an Album of the Day almost every weekday since 2011, and a feature there can make an unknown artist’s year. I scraped all 2,287 features, matched them to the Spotify Web API, cleaned 422 messy location strings into 80 countries, and loaded everything into a modelled Postgres warehouse on Supabase. A layer of SQL views defines every metric once, and a Tableau dashboard, six analysis notebooks and a live web app all read from it. The question: where does editorial attention actually go?",
    context: "Personal Project",
    duration: "2021 – 2026",
    contributors: ["Bryan Garcia"],
    sections: [
      {
        type: "highlights",
        title: "Key Findings",
        items: [
          "US-based labels account for 54.8% of located features, and the top three countries (US, UK, Canada) for 74.9%",
          "The US share fell from 63.1% in 2017 to 44.2% in 2025, most of it in 2024–25. The same writers shifted rather than new ones arriving (χ² p = 0.02)",
          "66.2% of features are self-released, and that share held between 60% and 71% every year",
          "The 15 most active of 343 writers produced 29.5% of all coverage; genre specialisation, measured as Shannon entropy, ranges from 0.24 to 3.15 bits",
          "City scenes are real but narrow: Pittsburgh metal (11 of 12 features) and Chicago jazz (27 of 95) clear the evidence bar, while famous clichés like Bristol trip-hop don’t",
        ],
      },
      {
        type: "highlights",
        title: "What I Built",
        items: [
          "Python ELT pipeline (extract → transform → enrich → load) that is incremental, cached and idempotent, with 81 pytest tests",
          "Postgres warehouse on Supabase: a fact table, three dimensions and a pipeline audit trail, with upserts keyed on a SHA-1 content hash",
          "A semantic layer of 8 SQL views using CTEs and window functions, with lift and Shannon entropy computed in SQL",
          "A three-tab Tableau Public dashboard: Coverage, Editorial and Scenes",
          "A Next.js + TypeScript web app on Vercel with interactive charts, a searchable archive of every feature and a choropleth map, regenerated daily from the warehouse",
        ],
      },
      {
        type: "images",
        title: "The Web App",
        items: [
          { src: `${P(SLUG)}/images/app-overview.jpg`, caption: "Overview — the question, headline numbers and latest features" },
          { src: `${P(SLUG)}/images/app-geography.jpg`, caption: "US share of coverage by year, with the table view one click away" },
          { src: `${P(SLUG)}/images/app-scenes.jpg`, caption: "City × genre lift, with the evidence behind every bar" },
          { src: `${P(SLUG)}/images/app-archive.jpg`, caption: "Archive — all 2,287 features, searchable and filterable" },
          { src: `${P(SLUG)}/images/app-detail.jpg`, caption: "Feature detail with Spotify and Bandcamp links" },
          { src: `${P(SLUG)}/images/app-map.jpg`, caption: "Coverage by label country across 80 countries" },
        ],
      },
      {
        type: "data",
        title: "Analytics Table — 2,287 Features",
        dataUrl: `${P(SLUG)}/data/preview.json`,
        totalRows: 2287,
        sources: [
          { name: "Bandcamp Daily — Album of the Day", url: "https://daily.bandcamp.com/album-of-the-day" },
          { name: "Spotify Web API", url: "https://developer.spotify.com/documentation/web-api" },
        ],
      },
      {
        type: "code",
        title: "The Semantic Layer & Identity Key",
        githubUrl: REPO,
        files: [
          { filename: "views.sql", language: "sql", code: viewsSql },
          { filename: "identity.py", language: "python", code: identityPy },
        ],
      },
      {
        type: "text",
        title: "Caveats",
        content: "Locations are record-label locations, not artist locations, and Bandcamp’s catalogue by country isn’t public, so coverage share describes what was featured rather than proving editorial preference; the trend over time is the robust part. “Self-released” is rule-derived, 13.6% of features carry no genre tag, and the 79.6% Spotify match rate is a lower bound on availability. Each caveat is stated on the page next to the number it qualifies.",
      },
    ],
  },
};
