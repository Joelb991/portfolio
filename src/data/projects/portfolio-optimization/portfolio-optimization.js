
const P = (slug) => `/projects/${slug}`;
const SLUG = "portfolio-optimization";

export default {
  title: "Portfolio Optimization & CAPM Analysis",
  slug: SLUG,
  desc: "Applied Modern Portfolio Theory and the CAPM to a 10-stock universe, constructing mean-variance frontiers and decomposing risk using OLS regression.",
  tags: ["Portfolio Theory", "CAPM", "Excel Solver", "Finance"],
  cover: "/images/projects/portfolio_management_cover.png",
  icon: "\uD83D\uDCC8",
  categories: ["Excel", "Finance", "Optimization", "Linear Regression"],
  links: [],
  detail: {
    subtitle: "BUS-F 303: Intermediate Investments \u2014 Portfolio Management Project",
    overview: "Selected 10 securities spanning Information Technology, Consumer Electronics, Banking, Retail, Auto Manufacturing, and an ETF (QQQ) to analyze diversification benefits, construct mean-variance efficient frontiers, identify the optimal risky portfolio via Sharpe ratio maximization, and decompose individual stock risk and return using the CAPM single-index model. Built all optimization models in Excel using Solver across 9 spreadsheets, covering 10 years of monthly price data (2011\u20132020).",
    context: "Academic Project",
    course: "BUS-F 303: Intermediate Investments",
    program: "Indiana University, Kelley School of Business",
    duration: "Spring 2021",
    contributors: ["Bryan Garcia"],
    sections: [
      {
        type: "highlights",
        title: "Key Deliverables",
        items: [
          "Analyzed 10 stocks across 3+ industries using 10 years of monthly adjusted close prices (2011\u20132020)",
          "Computed annualized returns, standard deviations, and a 10\u00D710 pairwise correlation matrix",
          "Constructed the mean-variance efficient frontier using Excel Solver optimization across 20+ target return levels",
          "Identified the Global Minimum Variance Portfolio (21.28% return, 51% std. dev.) and optimal risky portfolio via Sharpe ratio",
          "Ran OLS regressions for all 10 stocks to estimate alpha, beta, and residual standard deviation under the CAPM",
          "Decomposed expected returns into CAPM-required and mispricing (alpha) components",
          "Decomposed total risk into systematic and idiosyncratic components for each stock",
          "Compared unconstrained vs. no-short-selling efficient frontiers and plotted the Capital Market Line",
        ],
      },
      {
        type: "text",
        title: "Stock Selection & Data",
        content: "The 10-stock universe included Accenture (ACN), Starbucks (SBUX), Sony (SONY), Invesco QQQ ETF (QQQ), Bank of America (BAC), Microsoft (MSFT), Mastercard (MA), General Motors (GM), Walmart (WMT), and Nike (NKE). These were chosen to represent a range of industries, market capitalizations, and risk profiles. Monthly adjusted close prices were sourced from Yahoo Finance for the period January 2011 through December 2020. Annualized returns ranged from 8.85% (GM) to 30.38% (MA), while annualized standard deviations ranged from 54.88% (QQQ) to 118.93% (SONY).",
      },
      {
        type: "text",
        title: "Portfolio Theory \u2014 Mean-Variance Optimization",
        content: "From the 10-stock universe, 5 stocks (ACN, SBUX, SONY, QQQ, BAC) were selected to construct an optimal portfolio. A range of target returns from 5% to 30% was set up with 20 equally spaced points. For each target return, Excel Solver minimized portfolio standard deviation subject to weights summing to one and the expected return equaling the target. This traced the mean-variance efficient frontier. The Global Minimum Variance Portfolio was found at an expected return of 21.28% and standard deviation of 51%. The approximate maximum Sharpe ratio portfolio was identified by computing the Sharpe ratio at each frontier point (assuming a 2% risk-free rate) and selecting the highest value.",
      },
      {
        type: "text",
        title: "CAPM \u2014 Risk and Return Decomposition",
        content: "The S&P 500 index served as the market proxy and the 3-month Treasury yield (0.58% annualized) as the risk-free rate. OLS regressions of each stock's excess returns on the market's excess returns produced alpha, beta, and residual standard deviation estimates. Expected returns were decomposed into the required return component (from CAPM: risk-free + beta \u00D7 market premium) and the mispricing component (alpha). Total variance was split into systematic risk (beta\u00B2 \u00D7 market variance) and idiosyncratic risk (residual variance). Mastercard (MA) had the highest total return (30.38%) and largest historical mispricing (alpha = 17.75%), while Bank of America (BAC) had the highest required return due to its high beta of 1.64. Sony had the highest total risk.",
      },
      {
        type: "math",
        title: "Optimization Framework",
        blocks: [
          {
            type: "text",
            content: "The mean-variance frontier was constructed by solving the following optimization problem for each target return level:",
          },
          {
            type: "equation",
            label: "Objective Function",
            tex: "\\min_{w_i} \\; \\sigma_i = \\sqrt{\\text{Var}(w_1 r_1 + w_2 r_2 + w_3 r_3 + w_4 r_4 + w_5 r_5)}",
          },
          {
            type: "constraints",
            items: [
              { description: "Expected portfolio return equals the target", tex: "E[w_1 r_1 + w_2 r_2 + w_3 r_3 + w_4 r_4 + w_5 r_5] = R_i" },
              { description: "Weights sum to one (fully invested)", tex: "w_1 + w_2 + w_3 + w_4 + w_5 = 1" },
            ],
          },
          {
            type: "text",
            content: "The optimal risky portfolio was identified by maximizing the Sharpe ratio across all frontier portfolios:",
          },
          {
            type: "equation",
            label: "Sharpe Ratio",
            tex: "S = \\frac{R_p - R_f}{\\sigma_p}",
          },
          {
            type: "definitions",
            items: [
              { symbol: "w_i", desc: "Weight of stock i in the portfolio" },
              { symbol: "r_i", desc: "Return of stock i" },
              { symbol: "R_i", desc: "Target portfolio return level" },
              { symbol: "\\sigma_i", desc: "Portfolio standard deviation" },
              { symbol: "R_p", desc: "Expected portfolio return" },
              { symbol: "R_f", desc: "Risk-free rate (2%)" },
            ],
          },
          {
            type: "text",
            content: "For the no-short-selling variant, an additional constraint was added: all weights must be greater than or equal to zero. The two frontiers were compared on a single chart, showing that the constrained frontier lies inside or on the unconstrained frontier, confirming that short-selling constraints reduce diversification efficiency.",
          },
        ],
      },
      {
        type: "text",
        title: "Key Findings",
        content: "The pairwise correlation analysis revealed that the highest correlation was between Accenture and QQQ (0.73), while the lowest was between Walmart and Starbucks (0.08). This confirmed that firms in different industries with different business strategies provide the best diversification benefit. The constrained (no short-selling) and unconstrained efficient frontiers aligned near the Global Minimum Variance Portfolio but diverged at higher return targets, demonstrating that short-selling allows correlations to have their full effect in producing the most efficient frontier. The Capital Market Line, plotted from the risk-free rate through the tangent portfolio, showed the set of optimal portfolios achievable by combining the risky tangent portfolio with the risk-free asset.",
      },
      {
        type: "files",
        title: "Final Deliverables",
        items: [
          { name: "Portfolio Management Report.pdf", type: "pdf", url: `${P(SLUG)}/files/Portfolio_Management_Report.pdf` },
          { name: "Portfolio Management.xlsm", type: "xlsx", url: `${P(SLUG)}/files/Portfolio_Management.xlsm` },
        ],
      },
    ],
  },
};
