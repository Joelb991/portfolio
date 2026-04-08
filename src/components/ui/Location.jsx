
import { palette } from "@/styles/palette";
import MapPinIcon from "@/components/icons/MapPinIcon";

export default function Location({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: `${palette.ashGrey}77`, fontSize: 12 }}>
      <MapPinIcon />
      {children}
    </span>
  );
}

