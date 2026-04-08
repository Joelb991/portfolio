
const P = (slug) => `/projects/${slug}`;
const SLUG = "delta-valuation";

export default {
  title: "Delta Air Lines Valuation",
  slug: SLUG,
  desc: "Intrinsic valuation of Delta Air Lines using 10 years of SEC 10-K filings, pro-forma projections, and DCF modeling.",
  tags: ["Corporate Finance", "DCF", "Excel", "Valuation"],
  cover: "/images/projects/delta_cover.jpg",
  icon: "\u2708\uFE0F",
  categories: ["Excel", "Finance", "Valuation", "Airline", "Linear Regression"],
  links: [],
  detail: {
    subtitle: "BUS-F 305: Intermediate Corporate Finance \u2014 Final Team Project",
    overview: "Performed a comprehensive intrinsic valuation of Delta Air Lines (NYSE: DAL) as a final team project for Intermediate Corporate Finance at Indiana University. Analyzed 10 years of historical SEC 10-K filings (2010\u20132019), built 10-year pro-forma financial statements (2020\u20132029), projected free cash flows, and calculated an estimated stock price using a discounted cash flow model with WACC. Included sensitivity analysis across multiple variables and compared the estimated value against Delta\u2019s actual market price as of July 1, 2020.",
    context: "Academic Project",
    course: "BUS-F 305: Intermediate Corporate Finance",
    program: "Indiana University, Kelley School of Business",
    duration: "Fall 2020",
    contributors: ["Bryan Garcia"],
    sections: [
      {
        type: "highlights",
        title: "Key Deliverables",
        items: [
          "Analyzed 10 years of Delta Air Lines 10-K filings from SEC EDGAR (2010\u20132019)",
          "Built 10-year pro-forma income statements and balance sheets (2020\u20132029)",
          "Computed intrinsic stock price using WACC-based discounted cash flow model",
          "Performed sensitivity analysis on sales growth, WACC, and terminal growth rate",
          "Compared estimated stock price to actual DAL market price as of July 1, 2020",
        ],
      },
      {
        type: "text",
        title: "Methodology",
        content: "The valuation followed a structured DCF approach: (1) gathered historical financial data from COMPUSTAT via WRDS and SEC EDGAR, (2) analyzed real sales growth using CPI-adjusted figures from the St. Louis Federal Reserve, (3) classified Delta as a mature firm in the airline industry life cycle, (4) projected revenue, operating costs, and capital expenditures for 10 years, (5) calculated free cash flows to the firm, (6) discounted using a WACC in the 10\u201315% range, and (7) derived an implied share price. Sensitivity tables showed how the valuation shifted under different growth and discount rate assumptions.",
      },
      {
        type: "text",
        title: "Data Sources",
        content: "Historical financials were sourced from COMPUSTAT (via Wharton Research Data Services) and Delta\u2019s annual 10-K filings on SEC EDGAR. Consumer Price Index data came from the Federal Reserve Bank of St. Louis (FRED). Market data for the stock price comparison was pulled from Yahoo Finance. All raw 10-K filings (2010\u20132019) are available as downloadable PDFs below.",
      },
      {
        type: "files",
        title: "Final Deliverables",
        items: [
          { name: "Delta Report Analysis.docx", type: "docx", url: `${P(SLUG)}/files/Delta_Report_Analysis.docx` },
          { name: "Delta Pro-Forma.xlsx", type: "xlsx", url: `${P(SLUG)}/files/Delta_Pro-Forma.xlsx` },
          { name: "Project Instructions.pdf", type: "pdf", url: `${P(SLUG)}/files/Project_Instructions.pdf` },
        ],
      },
      {
        type: "files",
        title: "Raw 10-K Filings (SEC EDGAR, 2010\u20132019)",
        items: [
          { name: "10-K Filing 2019", type: "pdf", url: `${P(SLUG)}/files/10k-filings/10K_Filing_2019.pdf` },
          { name: "10-K Filing 2018", type: "pdf", url: `${P(SLUG)}/files/10k-filings/10K_Filing_2018.pdf` },
          { name: "10-K Filing 2017", type: "pdf", url: `${P(SLUG)}/files/10k-filings/10K_Filing_2017.pdf` },
          { name: "10-K Filing 2016", type: "pdf", url: `${P(SLUG)}/files/10k-filings/10K_Filing_2016.pdf` },
          { name: "10-K Filing 2015", type: "pdf", url: `${P(SLUG)}/files/10k-filings/10K_Filing_2015.pdf` },
          { name: "10-K Filing 2014", type: "pdf", url: `${P(SLUG)}/files/10k-filings/10K_Filing_2014.pdf` },
          { name: "10-K Filing 2013", type: "pdf", url: `${P(SLUG)}/files/10k-filings/10K_Filing_2013.pdf` },
          { name: "10-K Filing 2012", type: "pdf", url: `${P(SLUG)}/files/10k-filings/10K_Filing_2012.pdf` },
          { name: "10-K Filing 2011", type: "pdf", url: `${P(SLUG)}/files/10k-filings/10K_Filing_2011.pdf` },
          { name: "10-K Filing 2010", type: "pdf", url: `${P(SLUG)}/files/10k-filings/10K_Filing_2010.pdf` },
        ],
      },
    ],
  },
};
