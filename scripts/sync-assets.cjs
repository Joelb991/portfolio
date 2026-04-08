#!/usr/bin/env node

/**
 * sync-assets.js
 * ──────────────────────────────────────────────────────────
 * Syncs project assets from external project folders into
 * the portfolio's public/projects/ directory.
 *
 * Usage:
 *   node scripts/sync-assets.js
 *
 * Configuration:
 *   Edit the PROJECT_MAP below to add new projects.
 *   Each entry maps a slug to its source folder and what to copy.
 *
 * Structure created:
 *   public/projects/{slug}/
 *     ├── images/     (analysis visualizations)
 *     ├── files/      (PDFs, presentations, reports)
 *     └── data/       (preview JSON for raw data tables)
 */

const fs = require("fs");
const path = require("path");

// ── Where external project folders live ──
const PROJECTS_ROOT = path.resolve(__dirname, "../../");
const PUBLIC_DEST = path.resolve(__dirname, "../public/projects");

// ── Project mapping ──
// To add a new project:
//   1. Add an entry here
//   2. Add the project object in src/data/projects.js
const PROJECT_MAP = [
  {
    slug: "nyc-high-school-dashboard",
    source: "CorrelationOne-DS4A",
    images: ["images/*.png"],
    files: [
      { from: "Team23_Report.pdf" },
      { from: "Team23_Datafolio.pdf" },
      { from: "Team23_Slides.pdf" },
      { from: "tableau_visuals/Final Visuals.pdf", to: "Final_Visuals.pdf" },
      { from: "tableau_visuals/NYC Public High School Analysis.pdf", to: "NYC_Public_HS_Analysis.pdf" },
    ],
    dataPreviews: [
      { csv: "data/clean_data.csv", maxRows: 15, outputName: "preview_clean.json" },
      { csv: "data/2010-2016-school-safety-report.csv", maxRows: 15, outputName: "preview_safety.json" },
      { csv: "data/clean_geo_data.csv", maxRows: 15, outputName: "preview_geo.json" },
    ],
  },
  {
    slug: "airbnb-booking-predictions",
    source: "Airbnb-Booking-Prediction",
    images: ["images/*.png"],
    files: [{ from: "Airbnb-Presentation.pdf" }],
  },
  {
    slug: "bandcamp-webscraping",
    source: "Bandcamp_Album-of-the-Day",
    images: ["images/*.png"],
    dataPreview: { csv: "Bandcamp_Featured_Albums.csv", maxRows: 15 },
  },
  {
    slug: "delta-valuation",
    source: "Delta Valuation",
    files: [
      { from: "Delta Pro-Forma.xlsx", to: "Delta_Pro-Forma.xlsx" },
      { from: "Delta Report Analysis.docx", to: "Delta_Report_Analysis.docx" },
      { from: "Project Instruction.pdf", to: "Project_Instructions.pdf" },
      { from: "Raw 10K Filings for Period Ending (10_-19_)/PDF/10K Filing 2010.pdf", to: "10k-filings/10K_Filing_2010.pdf" },
      { from: "Raw 10K Filings for Period Ending (10_-19_)/PDF/10K Filing 2011.pdf", to: "10k-filings/10K_Filing_2011.pdf" },
      { from: "Raw 10K Filings for Period Ending (10_-19_)/PDF/10K Filing 2012.pdf", to: "10k-filings/10K_Filing_2012.pdf" },
      { from: "Raw 10K Filings for Period Ending (10_-19_)/PDF/10K Filing 2013.pdf", to: "10k-filings/10K_Filing_2013.pdf" },
      { from: "Raw 10K Filings for Period Ending (10_-19_)/PDF/10K Filing 2014.pdf", to: "10k-filings/10K_Filing_2014.pdf" },
      { from: "Raw 10K Filings for Period Ending (10_-19_)/PDF/10K Filing 2015.pdf", to: "10k-filings/10K_Filing_2015.pdf" },
      { from: "Raw 10K Filings for Period Ending (10_-19_)/PDF/10K Filing 2016.pdf", to: "10k-filings/10K_Filing_2016.pdf" },
      { from: "Raw 10K Filings for Period Ending (10_-19_)/PDF/10K Filing 2017.pdf", to: "10k-filings/10K_Filing_2017.pdf" },
      { from: "Raw 10K Filings for Period Ending (10_-19_)/PDF/10K Filing 2018.pdf", to: "10k-filings/10K_Filing_2018.pdf" },
      { from: "Raw 10K Filings for Period Ending (10_-19_)/PDF/10K Filing 2019.pdf", to: "10k-filings/10K_Filing_2019.pdf" },
    ],
  },
];

// ── Helpers ──
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`  SKIP (not found): ${path.basename(src)}`);
    return;
  }
  fs.copyFileSync(src, dest);
  console.log(`  COPY: ${path.basename(dest)}`);
}

function globCopy(srcDir, pattern, destDir) {
  const dir = path.dirname(path.join(srcDir, pattern));
  const ext = path.extname(pattern);
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(ext) && !f.startsWith("."));
  files.forEach((f) => copyFile(path.join(dir, f), path.join(destDir, f)));
}

function csvToPreviewJSON(csvPath, maxRows) {
  if (!fs.existsSync(csvPath)) return null;
  const raw = fs.readFileSync(csvPath, "utf8");
  const lines = raw.split("\n").filter((l) => l.trim());
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < Math.min(lines.length, maxRows + 1); i++) {
    const vals = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, j) => { row[h] = vals[j] || ""; });
    rows.push(row);
  }
  return { headers, rows, totalRows: lines.length - 1 };
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (c === "," && !inQuotes) { result.push(current.trim()); current = ""; }
    else current += c;
  }
  result.push(current.trim());
  return result;
}

// ── Main ──
console.log("\nSyncing project assets...\n");

for (const proj of PROJECT_MAP) {
  const srcRoot = path.join(PROJECTS_ROOT, proj.source);
  const destRoot = path.join(PUBLIC_DEST, proj.slug);

  if (!fs.existsSync(srcRoot)) {
    console.log(`SKIP ${proj.slug}: source folder not found (${proj.source})`);
    continue;
  }

  console.log(`${proj.slug} (from ${proj.source})`);

  // Images
  if (proj.images) {
    const imgDest = path.join(destRoot, "images");
    ensureDir(imgDest);
    proj.images.forEach((pattern) => globCopy(srcRoot, pattern, imgDest));
  }

  // Files
  if (proj.files) {
    const fileDest = path.join(destRoot, "files");
    ensureDir(fileDest);
    proj.files.forEach((f) => {
      const src = path.join(srcRoot, f.from);
      const dest = path.join(fileDest, f.to || path.basename(f.from));
      ensureDir(path.dirname(dest));
      copyFile(src, dest);
    });
  }

  // Data previews (single or multiple)
  const previews = proj.dataPreviews || (proj.dataPreview ? [proj.dataPreview] : []);
  if (previews.length > 0) {
    const dataDest = path.join(destRoot, "data");
    ensureDir(dataDest);
    for (const dp of previews) {
      const csvPath = path.join(srcRoot, dp.csv);
      const preview = csvToPreviewJSON(csvPath, dp.maxRows || 15);
      if (preview) {
        const outName = dp.outputName || "preview.json";
        fs.writeFileSync(path.join(dataDest, outName), JSON.stringify(preview, null, 2));
        console.log(`  DATA: ${outName} (${preview.headers.length} cols, ${preview.rows.length} rows)`);
      }
    }
  }

  console.log("");
}

console.log("Done! Assets synced to public/projects/\n");
