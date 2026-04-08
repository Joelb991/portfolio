
import { useState } from "react";
import { accent, palette } from "@/styles/palette";

export default function Button({ children, href, onClick, filled, small, style: sx = {} }) {
  const [hov, setHov] = useState(false);
  const isLink = !!href;
  const El = isLink ? "a" : "button";
  const linkProps = isLink ? { href, target: "_blank", rel: "noreferrer" } : { onClick };

  return (
    <El
      {...linkProps}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: small ? "6px 16px" : "10px 26px",
        borderRadius: 50,
        fontSize: small ? 12 : 13,
        fontWeight: 600,
        textDecoration: "none",
        letterSpacing: "0.5px",
        cursor: "pointer",
        background: filled ? (hov ? `${accent}dd` : accent) : (hov ? `${accent}18` : "transparent"),
        color: filled ? "#fff" : (hov ? "#fff" : palette.ashGrey),
        border: `1.5px solid ${hov ? accent : palette.ashGrey + "66"}`,
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? `0 4px 16px ${accent}25` : "none",
        transition: "all 0.3s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        outline: "none",
        ...sx,
      }}
    >
      {children}
    </El>
  );
}

