# Bryan Garcia — Portfolio

Data analytics portfolio: projects, experience and interests.

**Live site: [portfolio-chi-fawn-60.vercel.app](https://portfolio-chi-fawn-60.vercel.app)**

**Featured project:** [Bandcamp Album of the Day Analytics](https://portfolio-chi-fawn-60.vercel.app/projects/bandcamp-aotd).
It's an end-to-end analysis of 15 years of Bandcamp Daily: a Python pipeline into a Postgres warehouse, a SQL semantic layer, a
[Tableau dashboard](https://public.tableau.com/views/bandcamp_aotd/Coverage), and a
[live web app](https://bandcamp-aotd.vercel.app) ([source](https://github.com/Joelb991/Bandcamp_Album-of-the-Day)).

## What's on the site

| Page | What it shows |
|---|---|
| **Home** | About, experience, education and certifications |
| **Projects** | A featured project plus a grid filterable by tool, method and industry. Each project page (`/projects/<slug>`) is built from one data file and can include highlights, image galleries, sortable data previews, syntax-highlighted code (Python, R, SQL), KaTeX equations and downloadable deliverables. |
| **Interests** | Film, food, travel and sport, plus a music section charted from a Spotify playlist |
| **Contact** | Email, LinkedIn and GitHub |

## Stack

React 19 · Vite · React Router · KaTeX · deployed on Vercel. Styling is inline
against a shared palette (`src/styles/palette.js`). `vercel.json` rewrites every
route to the app, so deep links like `/projects/bandcamp-aotd` load directly.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

## Adding or updating a project

1. **Map its assets.** Add an entry to `PROJECT_MAP` in `scripts/sync-assets.cjs`:
   images, files, CSV data previews (optionally limited to chosen columns) and
   code snippets, read from the project's own folder in `~/03_Projects`.
2. **Sync.** `npm run sync -- <slug>` copies images, files and previews into
   `public/projects/<slug>/` and code into `src/data/projects/<slug>/code/`.
   Leave out the slug to sync every project.
3. **Describe it.** Create `src/data/projects/<slug>/<slug>.js` (copy an existing
   one) and add it to `src/data/projects/index.js`. It is routed to
   `/projects/<slug>` automatically; `FEATURED_PROJECT` picks the hero.

The music section's data (`src/data/playlistTracks.js`) is regenerated with
`npm run fetch-spotify`.

## Layout

```
src/
├── pages/            Home, Projects (grid + detail), Interests, Contact
├── components/       layout, UI, project sections, music charts, icons
├── data/             experience, education, certifications, interests, playlist
│   └── projects/     one folder per project: <slug>.js plus code/ snippets
└── styles/           palette and global CSS
public/
├── projects/<slug>/  synced images, files and data previews
└── images/           covers, logos, certifications, interests photos
scripts/              sync-assets.cjs, fetch-spotify-data.cjs
```
