
import { useState } from "react";
import { accent, palette } from "@/styles/palette";
import ChevronIcon from "@/components/icons/ChevronIcon";

export default function Expandable({ label, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "none", border: "none",
          color: palette.ashGrey, fontSize: 13, fontWeight: 600,
          cursor: "pointer", padding: "8px 0", transition: "color 0.3s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = accent}
        onMouseLeave={e => e.currentTarget.style.color = palette.ashGrey}
      >
        <ChevronIcon open={open} />
        {open ? `Hide ${label}` : `View ${label}`}
      </button>
      <div style={{ maxHeight: open ? 800 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
        {children}
      </div>
    </div>
  );
}

