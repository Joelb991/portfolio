
const P = (slug) => `/projects/${slug}`;
const SLUG = "airbnb-booking-predictions";

import airbnbCode from "./code/Airbnb-Prediction.R?raw";

export default {
  title: "Airbnb Booking Predictions",
  slug: SLUG,
  desc: "Built supervised ML models in R to predict NYC Airbnb bookings across 2.5M records.",
  tags: ["R", "Machine Learning", "EDA","Feature Engineering","Linear Regression","Regression Tree"],
  cover: "/images/projects/Airbnb-Presentation_Page_1.png",
  icon: "\u{1F3E0}",
  categories: ["R", "Machine Learning", "EDA", "Hospitality"],
  links: [{ label: "GitHub", type: "github", url: "https://github.com/Joelb991/Airbnb-Booking-Prediction" }],
  detail: {
    subtitle: "Supervised Learning in R",
    overview: "Developed supervised machine learning models in R to predict New York City Airbnb booking patterns using a dataset of 2.5 million records. Explored relationships between listing features, host behavior, and booking likelihood through extensive exploratory data analysis and feature engineering. Iterated through 10+ linear regression and 7 regression tree models, achieving an optimal R\u00B2 of 0.7325.",
    context: "Academic Project",
    course: "BUS-K 353: Business Analytics and Modeling",
    program: "Indiana University, Kelley School of Business",
    duration: "Fall 2021",
    contributors: ["Bryan Garcia", "Kavya Rajesh", "Kristina Dolan"],
    sections: [
      {
        type: "highlights",
        title: "Key Outcomes",
        items: [
          "Analyzed 2.5M Airbnb listing records across all five NYC boroughs",
          "Built and compared 10 linear regression + 7 regression tree models",
          "Best model achieved R\u00B2 = 0.7325 (RMSE = 15.66) using 8 features",
          "Identified key predictors: Superhost status, Q2 bookings, blocked days, and max guests",
        ],
      },
      {
        type: "images",
        title: "Exploratory Data Analysis",
        items: [
          { src: `${P(SLUG)}/images/corr_matrix.png`, caption: "Correlation Matrix \u2014 Numerical Features" },
          { src: `${P(SLUG)}/images/host_response_time.png`, caption: "Host Response Time \u2014 Regular vs. Superhost" },
          { src: `${P(SLUG)}/images/hist_maxguests.png`, caption: "Distribution of Max Guests" },
          { src: `${P(SLUG)}/images/hist_reviews.png`, caption: "Distribution of Number of Reviews" },
          { src: `${P(SLUG)}/images/model_stat.png`, caption: "Final Model Statistics" },
        ],
      },
      {
        type: "code",
        title: "Analysis Code",
        githubUrl: "https://github.com/Joelb991/Airbnb-Booking-Prediction",
        files: [
          {
            filename: "Airbnb-Prediction.R",
            language: "r",
            code: airbnbCode,
          },
        ],
      },
      {
        type: "files",
        title: "Project Files",
        items: [
          { name: "Airbnb-Presentation.pdf", type: "pdf", url: `${P(SLUG)}/files/Airbnb-Presentation.pdf` },
        ],
      },
    ],
  },
};
