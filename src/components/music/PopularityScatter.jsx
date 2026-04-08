
import { useState, useMemo } from "react";
import { palette } from "@/styles/palette";
import { genreColors } from "@/data/playlistTracks";
import FilterChip from "@/components/ui/FilterChip";

const MARGIN = { top: 24, right: 24, bottom: 44, left: 52 };
const SVG_W = 560;
const SVG_H = 380;
const PW = SVG_W - MARGIN.left - MARGIN.right;
const PH = SVG_H - MARGIN.top - MARGIN.bottom;

export default function PopularityScatter({ tracks }) {
  const genres = useMemo(() => [...new Set(tracks.map(t => t.genre))].sort(), [tracks]);
  const [hovered, setHovered] = useState(null);
  const [activeGenres, setActiveGenres] = useState(() => new Set(genres));

  const filtered = useMemo(() =>
    tracks.filter(t => activeGenres.has(t.genre)),
    [tracks, activeGenres],
  );

  // X = release year, Y = popularity (0-100)
  const years = useMemo(() => {
    const ys = tracks.map(t => {
      const rd = t.releaseDate;
      return rd ? parseInt(rd.slice(0, 4), 10) : null;
    }).filter(Boolean);
    return { min: Math.min(...ys), max: Math.max(...ys) };
  }, [tracks]);

  const yearRange = years.max - years.min || 1;

  function sx(releaseDate) {
    if (!releaseDate) return MARGIN.left;
    const yr = parseInt(releaseDate.slice(0, 4), 10);
    return MARGIN.left + ((yr - years.min) / yearRange) * PW;
  }

  function sy(pop) {
    return MARGIN.top + (1 - pop / 100) * PH;
  }

  function toggleGenre(g) {
    setActiveGenres(prev => {
      const next = new Set(prev);
      if (next.has(g)) {
        if (next.size === 1) return prev;
        next.delete(g);
      } else {
        next.add(g);
      }
      return next;
    });
  }

  // Popularity zones
  const zones = [
    { label: "Mainstream", y: 0, h: 35, color: "rgba(255,255,255,0.03)" },
    { label: "Mid-Range", y: 35, h: 35, color: "transparent" },
    { label: "Deep Cuts", y: 70, h: 30, color: "rgba(255,255,255,0.03)" },
  ];

  return (
    <div>
      {/* Genre filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <span style={{
          color: `${palette.ashGrey}77`, fontSize: 10, fontWeight: 700,
          letterSpacing: "1.5px", textTransform: "uppercase", alignSelf: "center", marginRight: 4,
        }}>
          Genre
        </span>
        {genres.map(g => (
          <FilterChip key={g} label={g} active={activeGenres.has(g)} onClick={() => toggleGenre(g)} />
        ))}
      </div>

      <div style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ display: "block" }}>
          {/* Background zones */}
          {zones.map(z => (
            <g key={z.label}>
              <rect
                x={MARGIN.left} y={sy(100 - z.y)}
                width={PW} height={(z.h / 100) * PH}
                fill={z.color} rx={2}
              />
              <text
                x={MARGIN.left + PW - 6}
                y={sy(100 - z.y - z.h / 2)}
                textAnchor="end"
                dominantBaseline="central"
                fill="rgba(255,255,255,0.10)"
                fontSize={10}
                fontWeight={700}
                fontFamily="inherit"
                style={{ textTransform: "uppercase", letterSpacing: "1px" }}
              >
                {z.label}
              </text>
            </g>
          ))}

          {/* Gridlines */}
          {[0, 25, 50, 75, 100].map(v => (
            <g key={`y-${v}`}>
              <line x1={MARGIN.left} y1={sy(v)} x2={MARGIN.left + PW} y2={sy(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={MARGIN.left - 8} y={sy(v)} textAnchor="end" dominantBaseline="central" fill={`${palette.ashGrey}66`} fontSize={9} fontFamily="inherit">
                {v}
              </text>
            </g>
          ))}

          {/* X-axis decade markers */}
          {(() => {
            const ticks = [];
            const startDecade = Math.floor(years.min / 10) * 10;
            for (let d = startDecade; d <= years.max + 5; d += 10) {
              if (d >= years.min - 2) {
                const x = MARGIN.left + ((d - years.min) / yearRange) * PW;
                if (x >= MARGIN.left && x <= MARGIN.left + PW) {
                  ticks.push(
                    <g key={d}>
                      <line x1={x} y1={MARGIN.top} x2={x} y2={MARGIN.top + PH} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                      <text x={x} y={SVG_H - 6} textAnchor="middle" fill={`${palette.ashGrey}66`} fontSize={9} fontFamily="inherit">
                        {d}
                      </text>
                    </g>
                  );
                }
              }
            }
            return ticks;
          })()}

          {/* Axis labels */}
          <text x={MARGIN.left + PW / 2} y={SVG_H - 20} textAnchor="middle" fill={`${palette.ashGrey}88`} fontSize={11} fontWeight={600} fontFamily="inherit">
            Release Year
          </text>
          <text
            x={14} y={MARGIN.top + PH / 2}
            textAnchor="middle" fill={`${palette.ashGrey}88`} fontSize={11} fontWeight={600} fontFamily="inherit"
            transform={`rotate(-90, 14, ${MARGIN.top + PH / 2})`}
          >
            Popularity (0–100)
          </text>

          {/* Dots */}
          {filtered.map((t, i) => {
            if (!t.releaseDate) return null;
            const isHov = hovered === i;
            return (
              <circle
                key={`${t.name}-${i}`}
                cx={sx(t.releaseDate)}
                cy={sy(t.popularity)}
                r={isHov ? 8 : 5.5}
                fill={genreColors[t.genre] || "#888"}
                stroke={isHov ? "#fff" : "rgba(0,0,0,0.3)"}
                strokeWidth={isHov ? 2 : 1}
                opacity={isHov ? 1 : 0.85}
                style={{ cursor: "pointer", transition: "r 0.15s, stroke-width 0.15s" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        {hovered !== null && filtered[hovered] && (() => {
          const t = filtered[hovered];
          if (!t.releaseDate) return null;
          const pctX = (sx(t.releaseDate) / SVG_W) * 100;
          const pctY = (sy(t.popularity) / SVG_H) * 100;
          const flipX = pctX > 65;
          const flipY = pctY < 15;
          return (
            <div style={{
              position: "absolute", left: `${pctX}%`, top: `${pctY}%`,
              transform: `translate(${flipX ? "calc(-100% - 12px)" : "12px"}, ${flipY ? "4px" : "-50%"})`,
              background: "rgba(35, 41, 48, 0.95)", backdropFilter: "blur(10px)",
              border: `1px solid ${genreColors[t.genre]}44`, borderRadius: 10,
              padding: "10px 14px", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 10,
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {t.albumArt && <img src={t.albumArt} alt="" width={40} height={40} style={{ borderRadius: 4, flexShrink: 0 }} />}
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ color: `${palette.ashGrey}bb`, fontSize: 11 }}>{t.artist}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
                <span style={{ color: `${palette.ashGrey}88`, fontSize: 10 }}>
                  Popularity: <span style={{ color: "#fff", fontWeight: 600 }}>{t.popularity}</span>
                </span>
                <span style={{ color: `${palette.ashGrey}88`, fontSize: 10 }}>
                  Released: <span style={{ color: "#fff", fontWeight: 600 }}>{t.releaseDate?.slice(0, 4)}</span>
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
        {genres.map(g => (
          <div key={g} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: genreColors[g] }} />
            <span style={{ color: `${palette.ashGrey}99`, fontSize: 10, fontWeight: 500 }}>{g}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
