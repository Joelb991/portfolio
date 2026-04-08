
import { palette } from "@/styles/palette";

export default function Footer() {
  return (
    <footer style={{
      padding: "24px 48px",
      background: palette.darkerBg,
      borderTop: `1px solid ${palette.jetBlack}`,
      textAlign: "center",
    }}>
      <p style={{ color: `${palette.ashGrey}55`, fontSize: 12, margin: 0 }}>
        © 2026 Bryan Garcia
      </p>
    </footer>
  );
}

