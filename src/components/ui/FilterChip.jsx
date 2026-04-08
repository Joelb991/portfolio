
import { useState } from "react";
import { accent, palette } from "@/styles/palette";

export default function FilterChip({ label, active, onClick }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "5px 14px", borderRadius: 50, fontSize: 12, fontWeight: 500,
        border: `1px solid ${active ? accent : `${palette.ashGrey}33`}`,
        background: active ? `${accent}20` : (hov ? `${palette.ashGrey}0a` : "transparent"),
        color: active ? accent : palette.ashGrey,
        cursor: "pointer", transition: "all 0.2s", outline: "none",
      }}
    >
      {label}
    </button>
  );
}

