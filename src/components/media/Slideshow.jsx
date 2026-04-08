
import { useState, useEffect } from "react";
import { accent, palette } from "@/styles/palette";

export default function Slideshow({ photos, aspectRatio = "16/9" }) {
  const [idx, setIdx] = useState(0);
  const len = photos.length;

  useEffect(() => {
    const timer = setInterval(() => setIdx(p => (p + 1) % len), 5000);
    return () => clearInterval(timer);
  }, [len]);

  const go = (d) => setIdx(p => (p + d + len) % len);

  const arrowStyle = {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    width: 38, height: 38, borderRadius: 50, border: "none", cursor: "pointer",
    background: "rgba(0,0,0,0.45)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.3s", backdropFilter: "blur(4px)",
  };

  return (
    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: palette.darkerBg, marginBottom: 28, aspectRatio }}>
      {photos.map((p, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: i === idx ? 1 : 0, transition: "opacity 0.8s ease" }}>
          {p.src ? (
            <img src={p.src} alt={p.title || ""} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${accent}18, ${palette.darkerBg})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 56, marginBottom: 12 }}>{p.emoji || "📷"}</span>
              <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 4px", textAlign: "center" }}>{p.title}</p>
              {p.caption && <p style={{ color: `${palette.ashGrey}88`, fontSize: 13, margin: 0, textAlign: "center" }}>{p.caption}</p>}
            </div>
          )}
          {p.src && p.title && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 24px 18px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
              <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 2px" }}>{p.title}</p>
              {p.caption && <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12.5, margin: 0 }}>{p.caption}</p>}
            </div>
          )}
        </div>
      ))}

      <button onClick={() => go(-1)} style={{ ...arrowStyle, left: 14 }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.7)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button onClick={() => go(1)} style={{ ...arrowStyle, right: 14 }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.7)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
        {photos.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 22 : 8, height: 8, borderRadius: 50, border: "none", cursor: "pointer", background: i === idx ? "#fff" : "rgba(255,255,255,0.4)", transition: "all 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

