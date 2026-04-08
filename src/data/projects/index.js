
/*──────────────────────────────────────────────────────────────────────────────
  PROJECTS INDEX
  ─────────────────────────────────────────────────────────────────────────────
  Each project lives in its own file in this folder.
  Code snippets are stored as raw files in  public/projects/{slug}/code/

  To add a new project:
    1. Create folder  public/projects/{your-slug}/  (with images/, files/, data/, code/ as needed)
    2. Create a new file  src/data/projects/{your-slug}.js  (copy any existing one as a template)
    3. Import and add it to ALL_PROJECTS below — it auto-routes to /projects/{slug}
──────────────────────────────────────────────────────────────────────────────*/

import spotifyUiOptimization from "./spotify-ui-optimization/spotify-ui-optimization";
import airbnbBookingPredictions from "./airbnb-booking-predictions/airbnb-booking-predictions";
import nycHighSchoolDashboard from "./nyc-high-school-dashboard/nyc-high-school-dashboard";
import deltaValuation from "./delta-valuation/delta-valuation";
import portfolioOptimization from "./portfolio-optimization/portfolio-optimization";


export const FEATURED_PROJECT = spotifyUiOptimization;

export const ALL_PROJECTS = [
  airbnbBookingPredictions,
  nycHighSchoolDashboard,
  deltaValuation,
  portfolioOptimization,
];

export const FILTER_BUCKETS = {
  "Tools & Technologies": ["Python", "R", "SQL", "Tableau", "Power BI", "Excel"],
  "Skills & Methods": ["Data Cleaning", "EDA", "Optimization", "Valuation", "A/B Testing","Linear Regression", "Regression Trees"],
  "Industry": ["Finance", "Marketing", "Healthcare", "Entertainment","Hospitality", "Education","Airline"],
};
