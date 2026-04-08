
import { palette } from "@/styles/palette";
import FadeIn from "@/components/ui/FadeIn";
import SectionTitle from "@/components/ui/SectionTitle";

export default function About() {
  return (
    <section style={{ padding: "80px 48px", background: palette.darkerBg }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <FadeIn><SectionTitle>About</SectionTitle></FadeIn>
        <FadeIn delay={0.1}>
          <p style={{ color: palette.ashGrey, fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
            I'm a data-driven professional passionate about transforming raw data into meaningful business outcomes. With a strong foundation in Finance, Information Systems, and Analytics from Indiana University's Kelley School of Business, I've spent the last four years building scalable BI solutions and driving data-informed decision-making in the supply chain industry working within the Finance team and collaborating with cross-functional engineering, accounting, and sales leadership.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p style={{ color: `${palette.ashGrey}bb`, fontSize: 15, lineHeight: 1.8 }}>
            Currently pursuing my MSBA at USC Marshall School of Business, I'm deepening my expertise in optimization modeling, machine learning, and applied statistics. I thrive at the intersection of technical analysis and business strategy. Looking to take my experience and skills to pivot into the entertainment, tech, and finance industries, where I can continue to leverage data to drive impactful business decisions and innovation. 
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

