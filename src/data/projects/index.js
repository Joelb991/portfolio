
/*──────────────────────────────────────────────────────────────────────────────
  PROJECTS INDEX
  ─────────────────────────────────────────────────────────────────────────────
  Each project lives in its own folder here: {slug}/{slug}.js, plus code/ for
  snippets imported with ?raw. Images, files and data previews live in
  public/projects/{slug}/.

  To add a new project:
    1. Map its assets in scripts/sync-assets.cjs, then run  npm run sync -- {slug}
    2. Create  src/data/projects/{slug}/{slug}.js  (copy any existing one as a template)
    3. Import and add it to ALL_PROJECTS below — it auto-routes to /projects/{slug}
──────────────────────────────────────────────────────────────────────────────*/

import spotifyUiOptimization from "./spotify-ui-optimization/spotify-ui-optimization";
import airbnbBookingPredictions from "./airbnb-booking-predictions/airbnb-booking-predictions";
import nycHighSchoolDashboard from "./nyc-high-school-dashboard/nyc-high-school-dashboard";
import deltaValuation from "./delta-valuation/delta-valuation";
import portfolioOptimization from "./portfolio-optimization/portfolio-optimization";
import bandcampAotd from "./bandcamp-aotd/bandcamp-aotd";


export const FEATURED_PROJECT = bandcampAotd;

export const ALL_PROJECTS = [
  spotifyUiOptimization,
  airbnbBookingPredictions,
  nycHighSchoolDashboard,
  deltaValuation,
  portfolioOptimization,
];

export const FILTER_BUCKETS = {
  "Tools & Technologies": ["Python", "R", "SQL", "Tableau", "Power BI", "Excel"],
  "Skills & Methods": ["Data Cleaning", "EDA", "Web Scraping", "Optimization", "Valuation", "A/B Testing","Linear Regression", "Regression Trees"],
  "Industry": ["Finance", "Marketing", "Healthcare", "Entertainment","Hospitality", "Education","Airline"],
};
