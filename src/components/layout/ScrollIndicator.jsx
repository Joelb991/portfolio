
import { useState, useEffect } from "react";
import { accent, palette } from "@/styles/palette";

export default function ScrollIndicator({ label = "Scroll to explore" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY < 100);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      onClick={() => window.scrollTo({ top: window.innerHeight - 60, behavior: "smooth" })}
      style={{
        position: "absolute", bottom: 16, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: visible ? 1 : 0, transition: "opacity 0.5s", cursor: "pointer",
        zIndex: 2,
      }}
    >
      <span style={{ color: `${palette.ashGrey}88`, fontSize: 12, letterSpacing: "1px", textTransform: "uppercase" }}>
        {label}
      </span>
      <div style={{ width: 20, height: 32, borderRadius: 10, border: `2px solid ${palette.ashGrey}44`, display: "flex", justifyContent: "center", paddingTop: 6 }}>
        <div style={{ width: 3, height: 8, borderRadius: 2, background: accent, animation: "scrollBounce 1.8s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

