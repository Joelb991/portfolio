
export default function ChevronIcon({ direction = "down", open = false }) {
  const points = {
    down:  "6 9 12 15 18 9",
    left:  "15 18 9 12 15 6",
    right: "9 18 15 12 9 6",
  };
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0)" }}
    >
      <polyline points={points[direction] || points.down} />
    </svg>
  );
}

