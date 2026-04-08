
import { useState, useEffect } from "react";
import { accent, palette } from "@/styles/palette";

function SortIcon({ direction }) {
  if (!direction) return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill={`${palette.ashGrey}33`} style={{ marginLeft: 4, flexShrink: 0 }}>
      <path d="M5 1L8 4H2L5 1Z" />
      <path d="M5 9L2 6H8L5 9Z" />
    </svg>
  );
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill={accent} style={{ marginLeft: 4, flexShrink: 0 }}>
      {direction === "asc" ? <path d="M5 2L8 5H2L5 2Z" /> : <path d="M5 8L2 5H8L5 8Z" />}
    </svg>
  );
}

export default function DataPreview({ dataUrl, sources, totalRows, title }) {
  const [data, setData] = useState(null);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(dataUrl)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => setError(true));
  }, [dataUrl]);

  if (error) return <p style={{ color: `${palette.ashGrey}66`, fontSize: 13 }}>Data preview unavailable.</p>;
  if (!data) return <div style={{ padding: 40, textAlign: "center", color: `${palette.ashGrey}44` }}>Loading data...</div>;

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(d => d === "asc" ? "desc" : d === "desc" ? null : "asc");
      if (sortDir === "desc") setSortCol(null);
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  let rows = [...data.rows];
  if (sortCol && sortDir) {
    rows.sort((a, b) => {
      const va = isNaN(Number(a[sortCol])) ? a[sortCol] : Number(a[sortCol]);
      const vb = isNaN(Number(b[sortCol])) ? b[sortCol] : Number(b[sortCol]);
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Select a meaningful subset of columns if there are too many
  const maxCols = 10;
  const displayHeaders = data.headers.length > maxCols ? data.headers.slice(0, maxCols) : data.headers;
  const isTruncated = data.headers.length > maxCols;

  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${accent}12`, background: palette.darkerBg }}>
      {/* header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", background: `${accent}08`, borderBottom: `1px solid ${accent}10` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{title || "Data Preview"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: `${palette.ashGrey}66`, fontSize: 11 }}>
            Showing {rows.length} of {data.totalRows || totalRows || "?"} rows
            {isTruncated && ` · ${displayHeaders.length} of ${data.headers.length} columns`}
          </span>
        </div>
      </div>

      {/* table */}
      <div style={{ overflowX: "auto", maxHeight: 420 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 36, color: `${palette.ashGrey}44`, fontWeight: 400 }}>#</th>
              {displayHeaders.map(h => (
                <th key={h} onClick={() => handleSort(h)} style={{ ...thStyle, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>{h}</span>
                    <SortIcon direction={sortCol === h ? sortDir : null} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${accent}06` }}
                onMouseEnter={e => e.currentTarget.style.background = `${accent}08`}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ ...tdStyle, color: `${palette.ashGrey}33`, fontWeight: 400 }}>{i + 1}</td>
                {displayHeaders.map(h => (
                  <td key={h} style={tdStyle} title={row[h]}>
                    {formatCell(row[h])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* sources footer */}
      {sources && sources.length > 0 && (
        <div style={{ padding: "12px 18px", borderTop: `1px solid ${accent}10`, background: `${accent}05` }}>
          <span style={{ color: `${palette.ashGrey}55`, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginRight: 10 }}>Data Sources</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer"
                style={{ color: accent, fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {s.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px 14px",
  textAlign: "left",
  color: accent,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.3px",
  borderBottom: `2px solid ${accent}20`,
  position: "sticky",
  top: 0,
  background: palette.darkerBg,
  zIndex: 1,
};

const tdStyle = {
  padding: "8px 14px",
  color: `${palette.ashGrey}cc`,
  fontSize: 12,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 180,
};

function formatCell(val) {
  if (val === undefined || val === null || val === "") return "—";
  const num = Number(val);
  if (!isNaN(num) && val !== "") {
    if (Number.isInteger(num)) return num.toLocaleString();
    return num.toFixed(3);
  }
  return String(val);
}
