export function RotatingWheel({ cx, cy, r, rotation }: { cx: number; cy: number; r: number; rotation: number }) {
  const spokes = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  return (
    <g transform={`rotate(${rotation} ${cx} ${cy})`}>
      <circle cx={cx} cy={cy} r={r} fill="#0f172a" stroke="#e2e8f0" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r * 0.28} fill="#e2e8f0" />
      {spokes.map((angle) => (
        <line
          key={angle}
          x1={cx}
          y1={cy}
          x2={cx + Math.cos(angle) * r * 0.75}
          y2={cy + Math.sin(angle) * r * 0.75}
          stroke="#e2e8f0"
          strokeWidth="2"
        />
      ))}
    </g>
  );
}
