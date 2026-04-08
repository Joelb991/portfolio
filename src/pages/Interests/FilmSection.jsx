
import { useState } from "react";
import { palette, accent as siteAccent } from "@/styles/palette";

const FILM_ACCENT = siteAccent; // single consistent color for all poster cards
import { filmPhotos, showPhotos, profileLinks } from "@/data/interests";
import FadeIn from "@/components/ui/FadeIn";
import ProfileLink from "@/components/media/ProfileLink";
import InterestSection from "./InterestSection";

const cardGlass = {
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 12,
  overflow: "hidden",
};

const rowLabel = {
  color: `${palette.ashGrey}77`,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  margin: "0 0 12px",
};

function PosterCard({ item, isShow }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...cardGlass,
        position: "relative",
        aspectRatio: "2/3",
        cursor: "default",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        transform: hov ? "scale(1.04) translateY(-4px)" : "scale(1)",
        boxShadow: hov
          ? `0 24px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.12)`
          : "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      {item.src && (
        <img
          src={item.src}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {/* Accent stripe — visible at rest */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: FILM_ACCENT,
        opacity: hov ? 0 : 0.55,
        transition: "opacity 0.3s",
      }} />

      {/* Hover overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(10,14,20,0.97) 0%, rgba(10,14,20,0.82) 45%, rgba(10,14,20,0.35) 100%)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        opacity: hov ? 1 : 0,
        transition: "opacity 0.35s ease",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "20px 12px 14px",
      }}>
        <p style={{ color: FILM_ACCENT, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 4px" }}>
          {item.genre} · {item.year}
        </p>
        <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "0 0 3px", lineHeight: 1.3 }}>{item.title}</p>
        <p style={{ color: `${palette.ashGrey}88`, fontSize: 10, margin: "0 0 10px" }}>
          {isShow ? item.network : `Dir. ${item.director}`}
        </p>
        <div style={{ height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 8 }} />
        <p style={{ color: `${palette.ashGrey}cc`, fontSize: 10, lineHeight: 1.6, margin: 0 }}>{item.stats}</p>
      </div>
    </div>
  );
}

export default function FilmSection() {
  return (
    <InterestSection title="Film & TV" subtitle="What I Watch" bg={palette.darkerBg} maxWidth={1100} profileLink={<ProfileLink {...profileLinks.letterboxd} />}>
      <FadeIn delay={0.1}>
        {/* Films row */}
        <p style={rowLabel}>Films</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 32 }}>
          {filmPhotos.map(film => <PosterCard key={film.title} item={film} isShow={false} />)}
        </div>

        {/* Shows row */}
        <p style={rowLabel}>Shows</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
          {showPhotos.map(show => <PosterCard key={show.title} item={show} isShow={true} />)}
        </div>

        <p style={{ color: `${palette.ashGrey}cc`, fontSize: 14, lineHeight: 1.8 }}>
          I gravitate toward horror and thrillers. I love a movie with a good needle drop. Hover any poster to see the numbers behind it.
        </p>
        <p style={{ color: `${palette.ashGrey}44`, fontSize: 10, fontWeight: 500, textAlign: "right", marginTop: 12 }}>Source: IMDb · Box office data</p>
      </FadeIn>
    </InterestSection>
  );
}
