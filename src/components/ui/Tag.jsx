
import { accent } from "@/styles/palette";

export default function Tag({ children }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 4,
      background: `${accent}15`,
      color: `${accent}cc`,
      fontSize: 11.5,
      fontWeight: 500,
      margin: "3px 4px 3px 0",
    }}>
      {children}
    </span>
  );
}

