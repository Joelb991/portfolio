
import { accent, palette } from "@/styles/palette";
import { schools } from "@/data/education";
import FadeIn from "@/components/ui/FadeIn";
import SectionTitle from "@/components/ui/SectionTitle";
import Expandable from "@/components/ui/Expandable";
import Location from "@/components/ui/Location";

export default function Education() {
  return (
    <section style={{ padding: "80px 48px", background: palette.darkerBg }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <FadeIn><SectionTitle>Education</SectionTitle></FadeIn>
        {schools.map((school, i) => (
          <FadeIn key={i} delay={i * 0.12}>
            <div style={{ marginBottom: 24, padding: 28, borderRadius: 10, background: palette.jetBlack, border: `1px solid ${accent}12` }}>
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 10,
                  background: `${accent}0a`, overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, border: `1px solid ${accent}15`,
                }}>
                  <img
                    src={school.logo}
                    alt={school.school}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    onError={e => { e.target.style.display = "none"; e.target.parentElement.innerHTML = `<span style="color:${palette.ashGrey}44;font-size:22px;font-weight:800">${school.school[0]}</span>`; }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 2 }}>
                    <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: 0 }}>{school.school}</h3>
                    <span style={{ color: `${palette.ashGrey}88`, fontSize: 12 }}>{school.period}</span>
                  </div>
                  <p style={{ color: `${palette.ashGrey}cc`, fontSize: 13, margin: "2px 0 4px" }}>{school.sub}</p>
                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{school.degree}</p>
                  <Location>{school.location}</Location>
                </div>
              </div>

              {school.activities.length > 0 && (
                <Expandable label="Activities & Involvement">
                  <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
                    {school.activities.map((act, j) => (
                      <div key={j} style={{
                        padding: "14px 16px", borderRadius: 8, background: palette.darkerBg,
                        border: `1px solid ${accent}0a`, position: "relative", overflow: "hidden",
                      }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: accent }} />
                        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: `${accent}0a`, overflow: "hidden",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, border: `1px solid ${accent}12`,
                          }}>
                            <img
                              src={act.logo}
                              alt={act.name}
                              style={{ width: "100%", height: "100%", objectFit: "contain" }}
                              onError={e => { e.target.style.display = "none"; e.target.parentElement.innerHTML = `<span style="color:${palette.ashGrey}44;font-size:14px;font-weight:800">${act.name[0]}</span>`; }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{act.name}</p>
                            <p style={{ color: accent, fontSize: 12, fontWeight: 500, margin: "0 0 6px" }}>{act.role}</p>
                            <p style={{ color: `${palette.ashGrey}bb`, fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>{act.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Expandable>
              )}

              <Expandable label="Coursework">
                <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 16, paddingBottom: 8 }}>
                  {Object.entries(school.coursework).map(([category, courses]) => (
                    <div key={category}>
                      <p style={{ color: `${palette.ashGrey}99`, fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 8px" }}>{category}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {courses.map(c => (
                          <span key={c} style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: 4,
                            background: `${accent}15`,
                            color: `${accent}cc`,
                            fontSize: 11.5,
                            fontWeight: 500,
                          }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Expandable>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
