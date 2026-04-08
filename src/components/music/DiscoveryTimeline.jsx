
import { useState, useMemo } from "react";
import { palette } from "@/styles/palette";

const MARGIN = { top: 20, right: 20, bottom: 40, left: 44 };
const SVG_W = 560;
const SVG_H = 240;
const PW = SVG_W - MARGIN.left - MARGIN.right;
const PH = SVG_H - MARGIN.top - MARGIN.bottom;
const ACCENT = "#7495a1";

export default function DiscoveryTimeline({ tracks }) {
  const [hovered, setHovered] = useState(null);

  // Group tracks by month (YYYY-MM)
  const { months, maxCount, cumulative } = useMemo(() => {
    const byMonth = {};
    const sorted = tracks
      .filter(t => t.addedAt)
      .sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));

    for (const t of sorted) {
      const key = t.addedAt.slice(0, 7); // YYYY-MM
      if (!byMonth[key]) byMonth[key] = [];
      byMonth[key].push(t);
    }

    // Fill in missing months
    const keys = Object.keys(byMonth).sort();
    if (keys.length === 0) return { months: [], maxCount: 0, cumulative: [] };

    const start = new Date(keys[0] + "-01");
    const end = new Date(keys[keys.length - 1] + "-01");
    const allMonths = [];
    let cum = 0;
    const cumData = [];

    const cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 7);
      const count = byMonth[key]?.length || 0;
      cum += count;
      allMonths.push({ key, count, tracks: byMonth[key] || [] });
      cumData.push(cum);
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return {
      months: allMonths,
      maxCount: Math.max(...allMonths.map(m => m.count)),
      cumulative: cumData,
    };
  }, [tracks]);

  if (months.length === 0) {
    return <p style={{ color: `${palette.ashGrey}88`, fontSize: 13, textAlign: "center" }}>No timestamp data available</p>;
  }

  const totalCum = cumulative[cumulative.length - 1] || 1;

  function sx(i) { return MARGIN.left + (i / (months.length - 1 || 1)) * PW; }
  function syBar(count) { return MARGIN.top + PH - (count / (maxCount || 1)) * PH; }
  function syCum(val) { return MARGIN.top + PH - (val / totalCum) * PH; }

  // Cumulative line path
  const linePath = cumulative.map((v, i) => `${i === 0 ? "M" : "L"}${sx(i)},${syCum(v)}`).join(" ");
  const areaPath = `${linePath} L${sx(months.length - 1)},${MARGIN.top + PH} L${sx(0)},${MARGIN.top + PH} Z`;

  // X-axis labels (show every few months to avoid crowding)
  const labelEvery = Math.max(1, Math.ceil(months.length / 8));

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ display: "block" }}>
        {/* Y gridlines */}
        {[0.25, 0.5, 0.75, 1].map(pct => {
          const y = MARGIN.top + PH - pct * PH;
          return (
            <g key={pct}>
              <line x1={MARGIN.left} y1={y} x2={MARGIN.left + PW} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              <text x={MARGIN.left - 6} y={y} textAnchor="end" dominantBaseline="central" fill={`${palette.ashGrey}55`} fontSize={8} fontFamily="inherit">
                {Math.round(pct * totalCum)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill={`${ACCENT}15`} />

        {/* Bars */}
        {months.map((m, i) => {
          const barW = Math.max(2, PW / months.length - 1);
          const barH = (m.count / (maxCount || 1)) * PH;
          const isHov = hovered === i;
          return (
            <rect
              key={m.key}
              x={sx(i) - barW / 2}
              y={MARGIN.top + PH - barH}
              width={barW}
              height={barH}
              rx={1}
              fill={isHov ? ACCENT : `${ACCENT}66`}
              style={{ cursor: m.count > 0 ? "pointer" : "default", transition: "fill 0.15s" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}

        {/* Cumulative line */}
        <path d={linePath} fill="none" stroke={ACCENT} strokeWidth={2} opacity={0.7} />

        {/* Baseline */}
        <line x1={MARGIN.left} y1={MARGIN.top + PH} x2={MARGIN.left + PW} y2={MARGIN.top + PH} stroke="rgba(255,255,255,0.10)" strokeWidth={1} />

        {/* X-axis labels */}
        {months.map((m, i) => {
          if (i % labelEvery !== 0 && i !== months.length - 1) return null;
          const [yr, mo] = m.key.split("-");
          const label = `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(mo, 10) - 1]} '${yr.slice(2)}`;
          return (
            <text key={m.key} x={sx(i)} y={SVG_H - 6} textAnchor="middle" fill={`${palette.ashGrey}66`} fontSize={8} fontFamily="inherit">
              {label}
            </text>
          );
        })}

        {/* Axis label */}
        <text
          x={10} y={MARGIN.top + PH / 2}
          textAnchor="middle" fill={`${palette.ashGrey}77`} fontSize={10} fontWeight={600} fontFamily="inherit"
          transform={`rotate(-90, 10, ${MARGIN.top + PH / 2})`}
        >
          Songs Added
        </text>
      </svg>

      {/* Tooltip */}
      {hovered !== null && months[hovered]?.count > 0 && (() => {
        const m = months[hovered];
        const [yr, mo] = m.key.split("-");
        const monthName = ["January","February","March","April","May","June","July","August","September","October","November","December"][parseInt(mo, 10) - 1];
        const pctX = (sx(hovered) / SVG_W) * 100;
        const flipX = pctX > 70;
        return (
          <div style={{
            position: "absolute", left: `${pctX}%`, top: "8px",
            transform: `translateX(${flipX ? "calc(-100% - 8px)" : "8px"})`,
            background: "rgba(35, 41, 48, 0.95)", backdropFilter: "blur(10px)",
            border: `1px solid ${ACCENT}44`, borderRadius: 10,
            padding: "10px 14px", pointerEvents: "none", zIndex: 10, maxWidth: 220,
          }}>
            <div style={{ color: "#fff", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
              {monthName} {yr}
            </div>
            <div style={{ color: `${palette.ashGrey}bb`, fontSize: 11, marginBottom: 4 }}>
              {m.count} song{m.count > 1 ? "s" : ""} added
            </div>
            {m.tracks.slice(0, 3).map((t, i) => (
              <div key={i} style={{ color: `${palette.ashGrey}99`, fontSize: 10, lineHeight: 1.5 }}>
                {t.name} — <span style={{ color: `${palette.ashGrey}66` }}>{t.artist}</span>
              </div>
            ))}
            {m.tracks.length > 3 && (
              <div style={{ color: `${palette.ashGrey}55`, fontSize: 10, marginTop: 2 }}>
                +{m.tracks.length - 3} more
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
