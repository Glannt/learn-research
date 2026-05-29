export function MotionTrail({ points, color = "#38bdf8" }: { points: { x: number; y: number }[]; color?: string }) {
  return (
    <g>
      {points.map((point, index) => (
        <circle
          key={`${point.x}-${point.y}-${index}`}
          cx={point.x}
          cy={point.y}
          r={3 + index * 0.18}
          fill={color}
          opacity={(index + 1) / Math.max(4, points.length) * 0.45}
        />
      ))}
    </g>
  );
}
