
import { useMemo, useState, useCallback } from "react";
import { palette } from "@/styles/palette";
import { genreColors } from "@/data/playlistTracks";

const BAR_GAP = 6;
const MARGIN = { top: 16, right: 16, bottom: 36, left: 40 };

export default function EraDistribution({ tracks }) {
  const [tooltip, setTooltip] = useState(null); // { x, y, decade, genre, songs }
  const [hoveredKey, setHoveredKey] = useState(null); // "decade-genre"

  const { decades, maxCount, genreBreakdown, songsByDecadeGenre } = useMemo(() => {
    const counts = {};
    const breakdown = {};
    const songMap = {};
    for (const t of tracks) {
      const d = t.decade || "Unknown";
      counts[d] = (counts[d] || 0) + 1;
      if (!breakdown[d]) breakdown[d] = {};
      breakdown[d][t.genre] = (breakdown[d][t.genre] || 0) + 1;
      const key = `${d}||${t.genre}`;
      if (!songMap[key]) songMap[key] = [];
      songMap[key].push({ name: t.name, artist: t.artist });
    }
    const sorted = Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
    return {
      decades: sorted,
      maxCount: Math.max(...sorted.map(([, n]) => n)),
      genreBreakdown: breakdown,
      songsByDecadeGenre: songMap,
    };
  }, [tracks]);

  const SVG_W = 520;
  const SVG_H = 260;
  const plotW = SVG_W - MARGIN.left - MARGIN.right;
  const plotH = SVG_H - MARGIN.top - MARGIN.bottom;
  const barW = Math.max(12, (plotW / decades.length) - BAR_GAP);

  const yTicks = [];
  const step = maxCount <= 5 ? 1 : maxCount <= 12 ? 2 : 5;
  for (let i = step; i <= maxCount; i += step) yTicks.push(i);

  const handleMouseEnter = useCallback((e, decade, genre, svgRef) => {
    const key = `${decade}||${genre}`;
    const songs = songsByDecadeGenre[key] || [];
    const rect = e.currentTarget.closest("svg").parentElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoveredKey(key);
    setTooltip({ x, y, decade, genre, songs });
  }, [songsByDecadeGenre]);

  const handleMouseMove = useCallback((e) => {
    if (!tooltip) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltip(t => t ? { ...t, x, y } : null);
  }, [tooltip]);

  const handleMouseLeave = useCallback(() => {
    setHoveredKey(null);
    setTooltip(null);
  }, []);

  return (
    <div style={{ position: "relative" }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ display: "block" }}>
        {/* Y-axis gridlines and labels */}
        {yTicks.map(v => {
          const y = MARGIN.top + plotH - (v / maxCount) * plotH;
          return (
            <g key={v}>
              <line x1={MARGIN.left} y1={y} x2={MARGIN.left + plotW} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={MARGIN.left - 8} y={y} textAnchor="end" dominantBaseline="central" fill={`${palette.ashGrey}66`} fontSize={9} fontFamily="inherit">
                {v}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line x1={MARGIN.left} y1={MARGIN.top + plotH} x2={MARGIN.left + plotW} y2={MARGIN.top + plotH} stroke="rgba(255,255,255,0.10)" strokeWidth={1} />

        {/* Stacked bars */}
        {decades.map(([decade, count], i) => {
          const x = MARGIN.left + i * (barW + BAR_GAP) + BAR_GAP / 2;
          const fullH = (count / maxCount) * plotH;
          const breakdown = genreBreakdown[decade] || {};
          const genres = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

          let yOffset = 0;
          const segments = genres.map(([genre, n]) => {
            const segH = (n / count) * fullH;
            const seg = { genre, y: MARGIN.top + plotH - yOffset - segH, h: segH };
            yOffset += segH;
            return seg;
          });

          return (
            <g key={decade}>
              {segments.map((seg, si) => {
                const key = `${decade}||${seg.genre}`;
                const isHovered = hoveredKey === key;
                return (
                  <rect
                    key={si}
                    x={x}
                    y={seg.y}
                    width={barW}
                    height={Math.max(0, seg.h)}
                    rx={si === segments.length - 1 ? 3 : 0}
                    fill={genreColors[seg.genre] || "#888"}
                    opacity={hoveredKey === null ? 0.85 : isHovered ? 1 : 0.35}
                    style={{ cursor: "pointer", transition: "opacity 0.15s" }}
                    onMouseEnter={(e) => handleMouseEnter(e, decade, seg.genre)}
                  />
                );
              })}
              {/* Count label */}
              <text
                x={x + barW / 2}
                y={MARGIN.top + plotH - fullH - 6}
                textAnchor="middle"
                fill="#fff"
                fontSize={10}
                fontWeight={700}
                fontFamily="inherit"
              >
                {count}
              </text>
              {/* Decade label */}
              <text
                x={x + barW / 2}
                y={MARGIN.top + plotH + 16}
                textAnchor="middle"
                fill={`${palette.ashGrey}99`}
                fontSize={10}
                fontWeight={600}
                fontFamily="inherit"
              >
                {decade}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x + 14,
          top: tooltip.y - 10,
          transform: tooltip.x > 380 ? "translateX(-110%)" : "none",
          pointerEvents: "none",
          zIndex: 10,
          background: "rgba(20,24,30,0.97)",
          border: `1px solid ${genreColors[tooltip.genre] || "#888"}44`,
          borderRadius: 10,
          padding: "10px 14px",
          minWidth: 180,
          maxWidth: 260,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: genreColors[tooltip.genre] || "#888", flexShrink: 0 }} />
            <span style={{ color: genreColors[tooltip.genre] || "#888", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>{tooltip.genre}</span>
            <span style={{ color: `${palette.ashGrey}55`, fontSize: 10, marginLeft: "auto" }}>{tooltip.decade}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {tooltip.songs.map((s, i) => (
              <div key={i}>
                <p style={{ color: "#fff", fontSize: 11, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{s.name}</p>
                <p style={{ color: `${palette.ashGrey}77`, fontSize: 10, margin: 0 }}>{s.artist}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
        {Object.keys(genreColors).filter(g => tracks.some(t => t.genre === g)).map(g => (
          <div key={g} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: genreColors[g] }} />
            <span style={{ color: `${palette.ashGrey}99`, fontSize: 10, fontWeight: 500 }}>{g}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
