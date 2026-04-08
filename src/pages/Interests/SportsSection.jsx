
import { useState } from "react";
import { palette, accent } from "@/styles/palette";
import { soccerPhotos, hikingPhotos, climbingPhotos, profileLinks } from "@/data/interests";
import FadeIn from "@/components/ui/FadeIn";
import ProfileLink from "@/components/media/ProfileLink";
import InterestSection from "./InterestSection";

const glass = {
  background: "rgba(255, 255, 255, 0.04)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 16,
  overflow: "hidden",
};

const arrowBtn = {
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer",
  background: "rgba(0,0,0,0.5)", color: "#fff",
  display: "flex", alignItems: "center", justifyContent: "center",
  backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
  transition: "background 0.2s",
  zIndex: 2,
};

const sports = [
  {
    name: "Soccer",
    photos: soccerPhotos,
    kpis: [
      { label: "Rec Leagues", value: "9+" },
      { label: "Position", value: "Midfield" },
      { label: "Club", value: "Liverpool F.C." },
    ],
    note: "I enjoy spending a afternoon doing pickup games or following the Premier League on the weekends.",
  },
  {
    name: "Hiking",
    photos: hikingPhotos,
    kpis: [
      { label: "U.S. States", value: "7+" },
      { label: "National Parks", value: "6" },
      { label: "Favorite", value: "Zion" },
    ],
    note: "I love exploring new trails for the fresh air and views. My favorite hike by far has been the Narrows in Zion National Park.",
  },
  {
    name: "Rock Climbing",
    photos: climbingPhotos,
    kpis: [
      { label: "Style", value: "Bouldering" },
      { label: "Grade", value: "V3 → V4" },
      { label: "Frequency", value: "1x/week" },
    ],
    note: "I've just started climbing this year and have been loving the challenge and variety it offers. Currently hard stuck on v3s but making progress!",
  },
];

function SportCard({ sport }) {
  const [imgIdx, setImgIdx] = useState(0);
  const len = sport.photos.length;
  const photo = sport.photos[imgIdx];
  const go = (d) => setImgIdx(p => (p + d + len) % len);

  return (
    <div style={{ ...glass, display: "flex", flexDirection: "column" }}>
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", flexShrink: 0 }}>
        {photo?.src && (
          <img
            src={photo.src}
            alt={sport.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
        {/* Bottom gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 45%)" }} />

        {/* Prev arrow */}
        {len > 1 && (
          <button
            onClick={() => go(-1)}
            style={{ ...arrowBtn, left: 10 }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.75)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.5)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Next arrow */}
        {len > 1 && (
          <button
            onClick={() => go(1)}
            style={{ ...arrowBtn, right: 10 }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.75)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.5)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Dot indicators */}
        {len > 1 && (
          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 2 }}>
            {sport.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                style={{
                  width: i === imgIdx ? 18 : 6, height: 6, borderRadius: 50,
                  border: "none", cursor: "pointer", padding: 0,
                  background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.35)",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats Panel */}
      <div style={{ padding: "18px 22px 24px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div>
          <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.2px" }}>{sport.name}</h3>
          {photo?.caption && (
            <p style={{ color: `${palette.ashGrey}88`, fontSize: 12, margin: 0 }}>{photo.title} — {photo.caption}</p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {sport.kpis.map(kpi => (
            <div
              key={kpi.label}
              style={{
                flex: 1, background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 8, padding: "11px 6px", textAlign: "center",
              }}
            >
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "0 0 4px", lineHeight: 1.2 }}>{kpi.value}</p>
              <p style={{ color: `${palette.ashGrey}77`, fontSize: 10, margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>{kpi.label}</p>
            </div>
          ))}
        </div>
        <p style={{ color: `${palette.ashGrey}99`, fontSize: 13, fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>{sport.note}</p>
      </div>
    </div>
  );
}

export default function SportsSection() {
  return (
    <InterestSection title="Sports & Fitness" subtitle="Staying Active" bg={palette.jetBlack} maxWidth={1300} profileLink={<ProfileLink {...profileLinks.strava} />}>
      <FadeIn delay={0.1}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {sports.map(s => <SportCard key={s.name} sport={s} />)}
        </div>
      </FadeIn>
    </InterestSection>
  );
}
