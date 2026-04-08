
import { useState } from "react";
import { accent, palette } from "@/styles/palette";
import ExternalIcon from "@/components/icons/ExternalIcon";
import { SpotifyIcon, StravaIcon, LetterboxdIcon, BandcampIcon } from "@/components/icons/BrandIcons";

const brandLogos = {
  Spotify:    <SpotifyIcon size={16} />,
  Strava:     <StravaIcon size={16} />,
  Letterboxd: <LetterboxdIcon size={16} />,
  Bandcamp:   <BandcampIcon size={16} />,
};

export default function ProfileLink({ name, url, desc }) {
  const [hov, setHov] = useState(false);
  const logo = brandLogos[name];

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 26px",
        borderRadius: 50,
        fontSize: 13,
        fontWeight: 600,
        textDecoration: "none",
        letterSpacing: "0.5px",
        cursor: "pointer",
        background: hov ? `${accent}18` : "transparent",
        color: hov ? "#fff" : palette.ashGrey,
        border: `1.5px solid ${hov ? accent : palette.ashGrey + "66"}`,
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? `0 4px 16px ${accent}25` : "none",
        transition: "all 0.3s ease",
      }}
    >
      {logo}
      <span>{name}</span>
      {desc && <span style={{ color: hov ? `${palette.ashGrey}bb` : `${palette.ashGrey}66`, fontSize: 12, fontWeight: 400 }}>{desc}</span>}
      <ExternalIcon size={11} />
    </a>
  );
}
