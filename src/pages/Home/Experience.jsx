
import { accent, palette } from "@/styles/palette";
import { experiences } from "@/data/experience";
import FadeIn from "@/components/ui/FadeIn";
import SectionTitle from "@/components/ui/SectionTitle";
import Location from "@/components/ui/Location";
import { Link } from "react-router-dom";

export default function Experience() {
  return (
    <section style={{ padding: "80px 48px", background: palette.jetBlack }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <FadeIn><SectionTitle>Experience</SectionTitle></FadeIn>
        {experiences.map((exp, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div style={{ marginBottom: 40, padding: 28, borderRadius: 10, background: palette.darkBg, border: `1px solid ${accent}12`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: accent }} />
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: 0 }}>{exp.company}</h3>
                <span style={{ color: `${palette.ashGrey}88`, fontSize: 12 }}>{exp.period}</span>
              </div>
              <div style={{ marginBottom: 16 }}><Location>{exp.location}</Location></div>
              {exp.roles.map((role, j) => (
                <div key={j} style={{ marginBottom: j < exp.roles.length - 1 ? 24 : 0 }}>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>
                    {role.title}
                    <span style={{ color: `${palette.ashGrey}55`, fontSize: 11, fontWeight: 400, marginLeft: 6 }}>{role.period}</span>
                  </p>
                  {role.highlights && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
                      {role.highlights.map((h, k) => (
                        <div key={k} style={{ flex: "1 1 200px", padding: "14px 16px", borderRadius: 8, background: palette.darkerBg }}>
                          <span style={{ color: accent, fontSize: 22, fontWeight: 800, display: "block", marginBottom: 2 }}>{h.metric}</span>
                          {h.label && <span style={{ color: `${palette.ashGrey}99`, fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>{h.label}</span>}
                          <span style={{ color: `${palette.ashGrey}dd`, fontSize: 13, lineHeight: 1.55 }}>{h.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {role.tags && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                      {role.tags.map((tag) => (
                        <span key={tag} style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: 4,
                          background: `${accent}15`,
                          color: `${accent}cc`,
                          fontSize: 11.5,
                          fontWeight: 500,
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {exp.projectSlug && (
                <Link
                  to={`/projects/${exp.projectSlug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 16,
                    padding: "6px 14px",
                    borderRadius: 50,
                    border: `1px solid ${accent}44`,
                    background: `${accent}0a`,
                    color: accent,
                    fontSize: 12,
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}20`; e.currentTarget.style.borderColor = `${accent}88`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `${accent}0a`; e.currentTarget.style.borderColor = `${accent}44`; }}
                >
                  View Project
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                  </svg>
                </Link>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
