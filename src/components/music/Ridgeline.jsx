
import { useMemo } from "react";
import { genreColors } from "@/data/playlistTracks";

const MARGIN = { top: 20, right: 68, bottom: 28, left: 12 };
const SVG_W = 400;
const SVG_H = 420;
const PW = SVG_W - MARGIN.left - MARGIN.right;
const YEAR_MIN = 1952;
const YEAR_MAX = 2026;
const YEAR_RANGE = YEAR_MAX - YEAR_MIN;
const SAMPLES = 140;
const BANDWIDTH = 4;

function gauss(x) {
  return Math.exp(-0.5 * x * x) / 2.5066;
}

function kde(tracks, nSamples) {
  const points = [];
  for (let i = 0; i < nSamples; i++) {
    const year = YEAR_MIN + (i / (nSamples - 1)) * YEAR_RANGE;
    let density = 0;
    for (const t of tracks) {
      const yr = parseInt(t.releaseDate?.slice(0, 4), 10);
      if (isNaN(yr)) continue;
      const weight = 0.35 + (t.popularity / 100) * 0.65;
      density += weight * gauss((year - yr) / BANDWIDTH);
    }
    points.push({ year, density });
  }
  return points;
}

export default function Ridgeline({ tracks }) {
  const { ridges, globalMax } = useMemo(() => {
    const byGenre = {};
    for (const t of tracks) {
      if (!byGenre[t.genre]) byGenre[t.genre] = [];
      byGenre[t.genre].push(t);
    }

    const entries = Object.entries(byGenre).map(([genre, gTracks]) => {
      const years = gTracks.map(t => parseInt(t.releaseDate?.slice(0, 4), 10)).filter(Boolean).sort((a, b) => a - b);
      const median = years[Math.floor(years.length / 2)] || 2000;
      return { genre, tracks: gTracks, median };
    });
    entries.sort((a, b) => a.median - b.median);

    const ridges = entries.map(({ genre, tracks: gTracks }) => ({
      genre,
      count: gTracks.length,
      curve: kde(gTracks, SAMPLES),
    }));

    const globalMax = Math.max(...ridges.flatMap(r => r.curve.map(p => p.density)));
    return { ridges, globalMax };
  }, [tracks]);

  const ridgeCount = ridges.length;
  const ridgeSpacing = (SVG_H - MARGIN.top - MARGIN.bottom) / ridgeCount;
  const maxAmplitude = ridgeSpacing * 2.4;

  function sx(year) {
    return MARGIN.left + ((year - YEAR_MIN) / YEAR_RANGE) * PW;
  }

  const decades = [];
  for (let d = 1960; d <= 2020; d += 10) decades.push(d);

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ display: "block", background: "#050505", borderRadius: 10 }}
      >
        {/* Faint vertical decade lines */}
        {decades.map(d => (
          <g key={d}>
            <line
              x1={sx(d)} y1={MARGIN.top}
              x2={sx(d)} y2={SVG_H - MARGIN.bottom}
              stroke="rgba(255,255,255,0.04)" strokeWidth={1}
            />
            <text
              x={sx(d)} y={SVG_H - 8}
              textAnchor="middle"
              fill="rgba(255,255,255,0.18)"
              fontSize={8}
              fontFamily="inherit"
            >
              {d}
            </text>
          </g>
        ))}

        {/* Ridges — bottom-to-top render for occlusion */}
        {[...ridges].reverse().map((ridge, reverseIdx) => {
          const idx = ridgeCount - 1 - reverseIdx;
          const baseline = MARGIN.top + idx * ridgeSpacing + ridgeSpacing;

          const curvePts = ridge.curve.map(p => {
            const x = sx(p.year);
            const y = baseline - (p.density / (globalMax || 1)) * maxAmplitude;
            return { x, y };
          });

          const closedPath = curvePts.map((p, i) =>
            `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`
          ).join(" ")
            + ` L${curvePts[curvePts.length - 1].x.toFixed(1)},${baseline}`
            + ` L${curvePts[0].x.toFixed(1)},${baseline} Z`;

          const linePath = curvePts.map((p, i) =>
            `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`
          ).join(" ");

          const color = genreColors[ridge.genre] || "#fff";

          return (
            <g key={ridge.genre}>
              {/* Black fill — occludes ridges behind */}
              <path d={closedPath} fill="#050505" stroke="none" />
              {/* Tinted glow under the curve */}
              <path d={closedPath} fill={color} opacity={0.07} stroke="none" />
              {/* The ridge line */}
              <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth={1.8}
                strokeLinejoin="round"
              />
              {/* Genre label at right edge */}
              <text
                x={SVG_W - 4}
                y={baseline - ridgeSpacing * 0.3}
                textAnchor="end"
                dominantBaseline="central"
                fill={color}
                fontSize={8}
                fontWeight={600}
                fontFamily="inherit"
                opacity={0.65}
              >
                {ridge.genre}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
