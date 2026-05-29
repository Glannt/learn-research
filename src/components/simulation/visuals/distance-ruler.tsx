export function DistanceRuler({ x, y, width, meters }: { x: number; y: number; width: number; meters: number }) {
  const ticks = 10;
  return (
    <g>
      <line x1={x} y1={y} x2={x + width} y2={y} stroke="#94a3b8" strokeWidth="2" />
      {Array.from({ length: ticks + 1 }, (_, index) => {
        const tx = x + (index / ticks) * width;
        return (
          <g key={index}>
            <line x1={tx} y1={y - 8} x2={tx} y2={y + 8} stroke="#94a3b8" strokeWidth="2" />
            <text x={tx} y={y + 26} textAnchor="middle" fill="#cbd5e1" fontSize="11">
              {Math.round((index / ticks) * meters)}m
            </text>
          </g>
        );
      })}
    </g>
  );
}
