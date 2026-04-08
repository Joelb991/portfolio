
import { useState } from "react";
import { accent, palette } from "@/styles/palette";
import { certifications } from "@/data/certifications";
import FadeIn from "@/components/ui/FadeIn";
import SectionTitle from "@/components/ui/SectionTitle";

function CertModal({ cert, onClose }) {
  if (!cert) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, cursor: "zoom-out" }}>
      <div onClick={e => e.stopPropagation()} style={{ maxWidth: 800, width: "100%", borderRadius: 14, overflow: "hidden", background: palette.darkBg, cursor: "default" }}>
        {cert.img ? (
          <img src={cert.img} alt={cert.name} style={{ width: "100%", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: 360, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${accent}15, ${palette.darkerBg})` }}>
            <span style={{ fontSize: 48, opacity: 0.4, marginBottom: 12 }}>🏆</span>
            <p style={{ color: `${palette.ashGrey}55`, fontSize: 14 }}>Add image to public/images/certs/</p>
          </div>
        )}
        <div style={{ padding: "20px 24px" }}>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{cert.name}</h3>
          <p style={{ color: `${palette.ashGrey}88`, fontSize: 13, margin: 0 }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ""}</p>
        </div>
      </div>
      <button onClick={onClose} style={{ position: "absolute", top: 24, right: 28, width: 40, height: 40, borderRadius: 50, border: "none", background: "rgba(0,0,0,.6)", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
    </div>
  );
}

function CertCard({ cert, index, onSelect }) {
  const [hov, setHov] = useState(false);
  const hasLink = !!cert.credentialUrl;
  const handleClick = () => hasLink ? window.open(cert.credentialUrl, "_blank", "noreferrer") : onSelect(cert);
  const hoverLabel = hasLink ? "View Credential ↗" : "View Certificate";

  return (
    <FadeIn delay={index * 0.06}>
      <div onClick={handleClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ borderRadius: 12, overflow: "hidden", background: palette.darkBg, border: `1px solid ${hov ? accent + "33" : accent + "0a"}`, transform: hov ? "translateY(-3px)" : "translateY(0)", transition: "all 0.3s", cursor: "pointer" }}>
        <div style={{ width: "100%", height: 180, position: "relative", overflow: "hidden", background: cert.img ? "transparent" : `linear-gradient(135deg, ${accent}0e, ${palette.darkerBg})` }}>
          {cert.img ? (
            <img src={cert.img} alt={cert.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 40, opacity: 0.3 }}>🏆</span>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: hov ? "rgba(0,0,0,.4)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
            {hov && <span style={{ padding: "6px 16px", borderRadius: 50, background: "rgba(255,255,255,.9)", color: palette.jetBlack, fontSize: 12, fontWeight: 600 }}>{hoverLabel}</span>}
          </div>
        </div>
        <div style={{ padding: "16px 18px" }}>
          <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{cert.name}</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ color: `${palette.ashGrey}77`, fontSize: 12, margin: 0 }}>{cert.issuer}</p>
            {cert.date && <span style={{ color: `${palette.ashGrey}44`, fontSize: 11 }}>{cert.date}</span>}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export default function Certifications() {
  const [selected, setSelected] = useState(null);
  return (
    <>
      {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
      <section style={{ padding: "80px 48px", background: palette.jetBlack }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <FadeIn><SectionTitle>Certifications</SectionTitle></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {certifications.map((c, i) => (
              <CertCard key={i} cert={c} index={i} onSelect={setSelected} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

