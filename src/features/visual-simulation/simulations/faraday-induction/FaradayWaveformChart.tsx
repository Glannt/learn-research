import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FaradayWaveformChart({
  phase,
  inducedVoltage,
  current
}: {
  phase: number;
  inducedVoltage: number;
  current: number;
}) {
  const width = 720;
  const height = 170;
  const mid = height / 2;
  const markerX = ((phase % (Math.PI * 2)) / (Math.PI * 2)) * width;
  const path = Array.from({ length: 140 }, (_, index) => {
    const x = (index / 139) * width;
    const y = mid - Math.cos((index / 139) * Math.PI * 2) * 54;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Induced output over magnet motion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full rounded-lg border border-border bg-slate-950">
          <line x1="0" y1={mid} x2={width} y2={mid} stroke="#475569" strokeWidth="2" />
          <path d={path} fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <line x1={markerX} y1="15" x2={markerX} y2={height - 15} stroke="#f97316" strokeWidth="3" />
          <circle cx={markerX} cy={mid - Math.cos(phase) * 54} r="7" fill="#f97316" />
          <text x="14" y="24" fill="#94a3b8" fontSize="12">positive when magnet approaches</text>
          <text x="14" y={height - 14} fill="#94a3b8" fontSize="12">negative when magnet moves away</text>
        </svg>
        <div className="grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">Motion phase</p>
            <p className="text-lg font-semibold">{Math.round(((phase % (Math.PI * 2)) * 180) / Math.PI)} deg</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">epsilon</p>
            <p className="text-lg font-semibold">{inducedVoltage.toFixed(2)} V</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-muted-foreground">I</p>
            <p className="text-lg font-semibold">{current.toFixed(2)} A</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
