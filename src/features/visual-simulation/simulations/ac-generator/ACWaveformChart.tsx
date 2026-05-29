import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ACWaveformChart({
  samples,
  currentAngle,
  voltage,
  current
}: {
  samples: { x: number; y: number }[];
  currentAngle: number;
  voltage: number;
  current: number;
}) {
  const width = 720;
  const height = 180;
  const mid = height / 2;
  const scale = 62;
  const points = samples
    .map((sample, index) => {
      const x = (index / Math.max(1, samples.length - 1)) * width;
      const y = mid - sample.y * scale;
      return `${x},${y}`;
    })
    .join(" ");
  const phase = (currentAngle % (Math.PI * 2)) / (Math.PI * 2);
  const markerX = phase * width;
  const markerY = mid - (samples[Math.round(phase * (samples.length - 1))]?.y ?? 0) * scale;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Realtime AC waveform</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full rounded-lg border border-border bg-slate-950">
          <defs>
            <linearGradient id="waveGlow" x1="0" x2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <line x1="0" y1={mid} x2={width} y2={mid} stroke="#475569" strokeWidth="2" />
          {[0, 90, 180, 270, 360].map((degree) => {
            const x = (degree / 360) * width;
            return (
              <g key={degree}>
                <line x1={x} y1="20" x2={x} y2={height - 20} stroke="#1e293b" strokeWidth="1" />
                <text x={x + 4} y={height - 8} fill="#94a3b8" fontSize="12">{degree} deg</text>
              </g>
            );
          })}
          <polyline points={points} fill="none" stroke="url(#waveGlow)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
          <line x1={markerX} y1="18" x2={markerX} y2={height - 18} stroke="#f97316" strokeWidth="3" />
          <circle cx={markerX} cy={markerY} r="7" fill="#f97316" />
        </svg>
        <div className="grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">Coil angle</p>
            <p className="text-lg font-semibold">{Math.round(((currentAngle % (Math.PI * 2)) * 180) / Math.PI)} deg</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">epsilon(t)</p>
            <p className="text-lg font-semibold">{voltage.toFixed(2)} V</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">I(t)</p>
            <p className="text-lg font-semibold">{current.toFixed(2)} A</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
