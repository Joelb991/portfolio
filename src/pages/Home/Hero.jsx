
import { Link } from "react-router-dom";
import { accent, palette } from "@/styles/palette";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import ScrollIndicator from "@/components/layout/ScrollIndicator";

export default function Hero() {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      padding: "120px 48px 80px",
      background: `linear-gradient(160deg, ${palette.darkerBg} 0%, ${palette.jetBlack} 50%, ${palette.darkBg} 100%)`,
      position: "relative", overflow: "hidden", textAlign: "center",
    }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${accent}08` }} />
      <div style={{ maxWidth: 660, position: "relative", zIndex: 1 }}>
        <FadeIn>
          <div style={{
            width: 300, height: 300, borderRadius: "50%", overflow: "hidden",
            margin: "0 auto 24px", border: `3px solid ${accent}44`,
            boxShadow: `0 0 40px ${accent}15`,
          }}>
            <img
              src="/headshot.JPG"
              alt="Bryan Garcia"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </FadeIn>
        <FadeIn>
          <p style={{ color: accent, fontSize: 14, fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>Hey, I'm</p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <h1 style={{ color: "#fff", fontSize: 56, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-2px", lineHeight: 1.1 }}>Bryan Garcia</h1>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p style={{ color: palette.ashGrey, fontSize: 20, margin: "0 0 28px" }}>Business Analytics · Data Science · Finance</p>
        </FadeIn>
        <FadeIn delay={0.45}>
          <p style={{ color: `${palette.ashGrey}aa`, fontSize: 15, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 32px" }}>
            A Business Analytics Professional with a Global Perspective and 4 years of successful experience in turning complex data into scalable BI solutions and actionable insights. Based in Los Angeles and currently pursuing an MSBA degree at USC Marshall school of Business.
          </p>
        </FadeIn>
        <FadeIn delay={0.6}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 72 }}>
            <Link to="/projects"><Button>View Projects</Button></Link>
            <Link to="/contact"><Button>Get in Touch</Button></Link>
          </div>
        </FadeIn>
      </div>
      <ScrollIndicator />
    </section>
  );
}

