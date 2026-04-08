
const P = (slug) => `/projects/${slug}`;
const SLUG = "nyc-high-school-dashboard";

import cleaningCode from "./code/Data_Cleaning.py?raw";
import edaCode from "./code/Exploratory_Data_Analysis.py?raw";
import modelingCode from "./code/Modeling.py?raw";

export default {
  title: "NYC High School Dashboard",
  slug: SLUG,
  desc: "Interactive Tableau dashboards analyzing graduation and funding metrics across 480+ NYC public high schools.",
  tags: ["Tableau", "Data Viz", "Python", "Analytics"],
  cover: "/images/projects/hs-performing-factors_cover.png",
  icon: "\u{1F393}",
  categories: ["Tableau", "Python", "Data Cleaning", "EDA", "Linear Regression", "Regression Trees", "Education"],
  links: [
    { label: "GitHub", type: "github", url: "https://github.com/Joelb991/CorrelationOne-DS4A" },
  ],
  detail: {
    subtitle: "Correlation-One: Data Science for All Program \u2014 Team 23",
    overview: "A 13-week research project completed as part of the Correlation-One Data Science for All program. Investigated factors that influence high performance in New York City public high schools by analyzing demographic, financial, and geographic data from the NYC Department of Education across 486 public high schools and over 290,000 students.",
    context: "Capstone Project",
    program: "Correlation-One: Data Science for All (DS4A)",
    duration: "13 Weeks",
    contributors: ["Bryan Garcia", "Noah Morton", "Jarrell Cooper", "Essence Carson"],
    sections: [
      {
        type: "highlights",
        title: "Guiding Questions",
        items: [
          "In what way is school funding allocated to address socio-economic need?",
          "How do societal disparities affect graduation rate?",
          "What are some implementations that can improve graduation rates in NYC?",
        ],
      },
      {
        type: "data",
        title: "Cleaned Dataset \u2014 486 Schools \u00D7 40 Features",
        dataUrl: `${P(SLUG)}/data/preview_clean.json`,
        totalRows: 486,
        sources: [
          { name: "NYC DOE School Quality Reports (2018-19)", url: "https://infohub.nyced.org/reports/school-quality/school-quality-reports-and-resources/school-quality-report-citywide-data" },
        ],
      },
      {
        type: "data",
        title: "School Safety Report \u2014 Geographic Data",
        dataUrl: `${P(SLUG)}/data/preview_safety.json`,
        totalRows: 6310,
        sources: [
          { name: "NYC School Safety Report 2010-2016 (Kaggle)", url: "https://www.kaggle.com/new-york-city/ny-2010-2016-school-safety-report/home" },
        ],
      },
      {
        type: "data",
        title: "Merged Geo-Coded Dataset",
        dataUrl: `${P(SLUG)}/data/preview_geo.json`,
        totalRows: 436,
        sources: [
          { name: "NYC School Funding Transparency Forms", url: "https://infohub.nyced.org/reports/financial/financial-data-and-reports/new-york-state-school-funding-transparency-forms" },
        ],
      },
      {
        type: "text",
        title: "Data Cleaning & Feature Engineering",
        content: "Merged three primary data sources on DBN (District-Borough-Number) identifiers. Converted funding attributes to millions, created borough columns from DBN codes, engineered N-count versions of percentage attributes, and imputed missing values \u2014 NaN with medians (due to outliers), 'N<15' coded values with means, and '.' placeholders with averages. Created a graduation tier classifier: High (>95%), Medium (80-90%), Low (<80%). Final clean dataset: 486 rows \u00D7 40 columns.",
      },
      {
        type: "images",
        title: "Exploratory Data Analysis",
        items: [
          { src: `${P(SLUG)}/images/correlation_matrix.png`, caption: "Correlation Matrix \u2014 School Features" },
          { src: `${P(SLUG)}/images/grad_temp_scatter.png`, caption: "Graduation Rate vs. Temp Housing %" },
          { src: `${P(SLUG)}/images/features_boxplot.png`, caption: "Feature Distributions by Borough" },
          { src: `${P(SLUG)}/images/funding_scatterplot.png`, caption: "Funding vs. Graduation Rate" },
          { src: `${P(SLUG)}/images/features_histogram.png`, caption: "Key Feature Histograms" },
          { src: `${P(SLUG)}/images/funding_borough.png`, caption: "Funding Distribution by Borough" },
          { src: `${P(SLUG)}/images/OLS_results.png`, caption: "OLS Regression Results" },
          { src: `${P(SLUG)}/images/classification_analysis.png`, caption: "Graduation Classification Analysis" },
        ],
      },
      {
        type: "code",
        title: "Analysis Code",
        githubUrl: "https://github.com/Joelb991/CorrelationOne-DS4A",
        files: [
          {
            filename: "Data_Cleaning.ipynb",
            language: "python",
            code: cleaningCode,
          },
          {
            filename: "Exploratory_Data_Analysis.ipynb",
            language: "python",
            code: edaCode,
          },
          {
            filename: "Modeling.ipynb",
            language: "python",
            code: modelingCode,
          },
        ],
      },
      {
        type: "files",
        title: "Project Deliverables",
        items: [
          { name: "Team23_Report.pdf", type: "pdf", url: `${P(SLUG)}/files/Team23_Report.pdf` },
          { name: "Team23_Datafolio.pdf", type: "pdf", url: `${P(SLUG)}/files/Team23_Datafolio.pdf` },
          { name: "Team23_Slides.pdf", type: "pdf", url: `${P(SLUG)}/files/Team23_Slides.pdf` },
          { name: "Final Visuals (Tableau).pdf", type: "pdf", url: `${P(SLUG)}/files/Final_Visuals.pdf` },
          { name: "NYC Public HS Analysis (Tableau).pdf", type: "pdf", url: `${P(SLUG)}/files/NYC_Public_HS_Analysis.pdf` },
        ],
      },
    ],
  },
};
