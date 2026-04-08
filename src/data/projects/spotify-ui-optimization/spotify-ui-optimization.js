
const P = (slug) => `/projects/${slug}`;
const SLUG = "spotify-ui-optimization";

import optimizerCode from "./code/spotifyOptimizer.py?raw";
import guiCode from "./code/spotify-optimize-gui.py?raw";

export default {
  title: "Spotify UI Optimization",
  slug: SLUG,
  desc: "Built a Gurobi-based optimization model to maximize user preference across Spotify\u2019s UI page layouts, with a custom Tkinter GUI.",
  tags: ["Python", "Gurobi", "Optimization", "Tkinter"],
  cover: `${P(SLUG)}/images/spotify_logo.png`,
  icon: "\uD83C\uDFB5",
  categories: ["Python", "Optimization", "Entertainment"],
  links: [],
  detail: {
    subtitle: "Integer Programming for UI Layout",
    overview: "Developed a mixed-integer optimization model using Python and Gurobi to determine the optimal placement, sizing, and page assignment of UI modules across Spotify\u2019s mobile app interface. The model maximizes a weighted user preference score across multiple user segments and pages, subject to constraints on module size, page capacity, and placement rules. Built a custom Spotify-themed Tkinter desktop GUI to allow non-technical users to configure inputs, set constraints, and run the optimizer interactively.",
    context: "Academic Project",
    course: "DSO 577: Optimization Modeling for Prescriptive Analytics",
    program: "USC Marshall School of Business, MSBA",
    duration: "Fall 2025",
    contributors: ["Bryan Garcia", "Shen Li", "Fiona Wang", "Sri Vaishnavi Arza","Khushi Gohil"],
    sections: [
      {
        type: "highlights",
        title: "Key Outcomes",
        items: [
          "Formulated a binary integer program with 5 constraint families to optimize module placement across pages",
          "Maximized weighted user preference scores across multiple user segments (e.g., college students, professionals)",
          "Built a Spotify-themed Tkinter GUI with file browsing, constraint inputs, and real-time optimization logs",
          "Delivered a live demo with 3 distinct user persona datasets showing different optimal layouts",
          "Authored a 7-page technical description documenting the mathematical formulation, input/output specs, and validation rules",
        ],
      },
      {
        type: "math",
        title: "Mathematical Formulation",
        blocks: [
          {
            type: "text",
            content: "The optimizer reads an Excel workbook with four sheets \u2014 user group preference scores, module max sizes, page weights, and allowable percentage sizes \u2014 and solves a binary integer program to determine the optimal layout.",
          },
          {
            type: "heading",
            content: "Data & Parameters",
          },
          {
            type: "definitions",
            items: [
              { symbol: "I", desc: "Set of UI modules (e.g. search, favorites, new release)" },
              { symbol: "J", desc: "Set of user segments" },
              { symbol: "K", desc: "Set of percentage sizes" },
              { symbol: "P", desc: "Set of pages" },
              { symbol: "s_{ij}", desc: "Preference score of module i for user group j" },
              { symbol: "w_p", desc: "Weight assigned to page p" },
              { symbol: "l_i", desc: "Maximum allowed percentage for module i" },
              { symbol: "M_{min}", desc: "Minimum modules per page" },
              { symbol: "M_{max}", desc: "Maximum modules per page" },
            ],
          },
          {
            type: "heading",
            content: "Decision Variable",
          },
          {
            type: "equation",
            label: "Binary Variable",
            tex: "Z_{ikp} = \\begin{cases} 1 & \\text{if module } i \\text{ is assigned size } k \\text{ on page } p \\\\ 0 & \\text{otherwise} \\end{cases}",
          },
          {
            type: "heading",
            content: "Objective",
          },
          {
            type: "equation",
            label: "Maximize Weighted User Preference",
            tex: "\\text{Maximize} \\qquad \\sum_{i \\in I,\\, j \\in J,\\, k \\in K,\\, p \\in P} s_{ij} \\, w_p \\, Z_{ikp}",
          },
          {
            type: "heading",
            content: "Constraints",
          },
          {
            type: "constraints",
            items: [
              {
                description: "Each module can appear on at most one page",
                tex: "\\sum_{k \\in K,\\, p \\in P} Z_{ikp} \\leq 1 \\quad \\forall \\; i \\in I",
              },
              {
                description: "Module cannot exceed its maximum allowed size",
                tex: "Z_{ikp} = 0 \\quad \\text{for all } k > l_i",
              },
              {
                description: "Total sizes on each page must not exceed 100%",
                tex: "\\sum_{i \\in I,\\, k \\in K} k \\cdot Z_{ikp} \\leq 1.0 \\quad \\forall \\; p \\in P",
              },
              {
                description: "Recommendation module must be placed on Page 1",
                tex: "\\sum_{k \\in K} Z_{R,k,1} = 1",
              },
              {
                description: "Min/max number of modules per page",
                tex: "M_{min} \\leq \\sum_{i \\in I,\\, k \\in K} Z_{ikp} \\leq M_{max} \\quad \\forall \\; p \\in P",
              },
            ],
          },
        ],
      },
      {
        type: "code",
        title: "Source Code",
        files: [
          {
            filename: "spotifyOptimizer.py",
            language: "python",
            code: optimizerCode,
          },
          {
            filename: "spotify-optimize-gui.py",
            language: "python",
            code: guiCode,
          },
        ],
      },
      {
        type: "files",
        title: "Project Files",
        items: [
          { name: "Technical-Description.pdf", type: "pdf", url: `${P(SLUG)}/files/Technical-Description.pdf` },
          { name: "input_small.xlsx", type: "xlsx", url: `${P(SLUG)}/files/input_small.xlsx` },
          { name: "output-small.xlsx", type: "xlsx", url: `${P(SLUG)}/files/output-small.xlsx` },
        ],
      },
    ],
  },
};
