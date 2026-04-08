
import { accent, palette } from "@/styles/palette";
import FadeIn from "@/components/ui/FadeIn";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";

const contacts = [
  { label: "Email", value: "joelb99@icloud.com", href: "mailto:joelb99@icloud.com", icon: "✉️" },
  { label: "LinkedIn", value: "linkedin.com/in/brygarcia", href: "https://www.linkedin.com/in/brygarcia", Icon: LinkedInIcon },
  { label: "GitHub", value: "github.com/Joelb991", href: "https://www.github.com/Joelb991", Icon: GitHubIcon },
];

export default function Contact() {
  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", background: palette.jetBlack, display: "flex", alignItems: "center" }}>
      <section style={{ padding: "80px 48px", width: "100%" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <p style={{ color: `${palette.ashGrey}66`, fontSize: 13, fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>Let's Connect</p>
            <h1 style={{ color: "#fff", fontSize: 40, fontWeight: 800, margin: "0 0 16px", letterSpacing: "-1px" }}>Get in Touch</h1>
            <p style={{ color: `${palette.ashGrey}99`, fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>I'm always open to discussing analytics roles, data projects, or collaboration opportunities.</p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
              {contacts.map((c, i) => (
                <a key={i} href={c.href} target="_blank" rel="noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "20px 28px", borderRadius: 12,
                    background: palette.darkBg, border: `1px solid ${accent}15`,
                    width: "100%", maxWidth: 420, transition: "all 0.3s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}44`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${accent}15`; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 50, background: `${accent}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, color: palette.ashGrey }}>
                    {c.icon ? c.icon : <c.Icon size={20} />}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ color: `${palette.ashGrey}77`, fontSize: 11, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "1px" }}>{c.label}</p>
                    <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p style={{ color: `${palette.ashGrey}44`, fontSize: 13, marginTop: 40 }}>Based in Los Angeles, CA</p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

