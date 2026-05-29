import { Html } from "@react-three/drei";

export function CoilPositionIndicator({ angle, current }: { angle: number; current: number }) {
  const degrees = Math.round(((angle % (Math.PI * 2)) * 180) / Math.PI);
  const neutral = Math.abs(Math.sin(angle)) < 0.12;
  return (
    <Html position={[-1.2, 1.35, 1.05]} distanceFactor={8}>
      <div className="w-40 rounded-lg border border-white/15 bg-slate-950/90 p-2 text-[11px] text-white shadow-xl">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-amber-300">Coil angle</span>
          <span>{degrees} deg</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-700">
          <div className="h-2 rounded-full bg-amber-400" style={{ width: `${((degrees % 360) / 360) * 100}%` }} />
        </div>
        <p className="mt-2 text-slate-300">{neutral ? "Neutral zone: current near 0" : current >= 0 ? "Positive half-cycle" : "Negative half-cycle"}</p>
      </div>
    </Html>
  );
}
