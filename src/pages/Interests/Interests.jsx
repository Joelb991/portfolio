
import { palette } from "@/styles/palette";
import FadeIn from "@/components/ui/FadeIn";
import MusicSection from "./MusicSection";
import SportsSection from "./SportsSection";
import FilmSection from "./FilmSection";
import FoodSection from "./FoodSection";

export default function Interests() {
  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", background: palette.jetBlack }}>
      <section style={{ padding: "60px 48px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn>
            <p style={{ color: `${palette.ashGrey}66`, fontSize: 13, fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>Beyond the Data</p>
            <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-1px" }}>Interests</h1>
            <p style={{ color: `${palette.ashGrey}99`, fontSize: 15, lineHeight: 1.7, maxWidth: 560 }}>A few things that keep me inspired outside of analytics — from pickup soccer sessions to listening the latest albums.</p>
          </FadeIn>
        </div>
      </section>
      <MusicSection />
      <SportsSection />
      <FilmSection />
      <FoodSection />
    </div>
  );
}

