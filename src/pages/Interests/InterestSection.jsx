
import { accent, palette } from "@/styles/palette";
import FadeIn from "@/components/ui/FadeIn";

export default function InterestSection({ title, subtitle, bg, children, maxWidth = 960, profileLink }) {
  return (
    <section style={{ padding: "72px 48px", background: bg }}>
      <div style={{ maxWidth, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ color: `${palette.ashGrey}66`, fontSize: 12, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>{subtitle}</p>
              <h2 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.5px" }}>{title}</h2>
            </div>
            {profileLink && <div style={{ paddingTop: 8 }}>{profileLink}</div>}
          </div>
          <div style={{ width: 40, height: 3, background: accent, borderRadius: 2, marginBottom: 32 }} />
        </FadeIn>
        {children}
      </div>
    </section>
  );
}
