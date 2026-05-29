import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TransformerWaveformChart({
  phase,
  primaryVoltage,
  secondaryVoltage,
  secondaryCurrent
}: {
  phase: number;
  primaryVoltage: number;
  secondaryVoltage: number;
  secondaryCurrent: number;
}) {
  const width = 720;
  const height = 180;
  const mid = height / 2;
  const markerX = ((phase % (Math.PI * 2)) / (Math.PI * 2)) * width;
  const primaryScale = 44;
  const secondaryScale = 58;
  const primaryPath = Array.from({ length: 140 }, (_, index) => {
    const x = (index / 139) * width;
    const y = mid - Math.sin((index / 139) * Math.PI * 2) * primaryScale;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const secondaryPath = Array.from({ length: 140 }, (_, index) => {
    const x = (index / 139) * width;
    const y = mid - Math.sin((index / 139) * Math.PI * 2) * secondaryScale;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Primary and secondary waveforms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full rounded-lg border border-border bg-slate-950">
          <line x1="0" y1={mid} x2={width} y2={mid} stroke="#475569" strokeWidth="2" />
          <path d={primaryPath} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" opacity="0.82" />
          <path d={secondaryPath} fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
          <line x1={markerX} y1="16" x2={markerX} y2={height - 16} stroke="#f97316" strokeWidth="3" />
          <text x="14" y="24" fill="#38bdf8" fontSize="12">primary Vp</text>
          <text x="14" y="42" fill="#22c55e" fontSize="12">secondary Vs</text>
        </svg>
        <div className="grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">Vp instant</p>
            <p className="text-lg font-semibold">{primaryVoltage.toFixed(2)} V</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">Vs instant</p>
            <p className="text-lg font-semibold">{secondaryVoltage.toFixed(2)} V</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">Is load</p>
            <p className="text-lg font-semibold">{secondaryCurrent.toFixed(2)} A</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
