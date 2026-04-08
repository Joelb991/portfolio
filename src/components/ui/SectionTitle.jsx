
import { accent } from "@/styles/palette";

export default function SectionTitle({ children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
        {children}
      </h2>
      <div style={{ width: 40, height: 3, background: accent, borderRadius: 2, marginTop: 10 }} />
    </div>
  );
}

