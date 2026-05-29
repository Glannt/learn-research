export function VectorArrow({
  x,
  y,
  dx,
  dy,
  color = "#22c55e",
  label
}: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color?: string;
  label?: string;
}) {
  const id = `arrow-${color.replace("#", "")}`;
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill={color} />
        </marker>
      </defs>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={color} strokeWidth="4" markerEnd={`url(#${id})`} strokeLinecap="round" />
      {label ? (
        <text x={x + dx + 8} y={y + dy - 4} fill={color} fontSize="13" fontWeight="700">
          {label}
        </text>
      ) : null}
    </g>
  );
}
