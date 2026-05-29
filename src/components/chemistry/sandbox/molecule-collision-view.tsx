import type { ReactionSimulation } from "@/types";

export function MoleculeCollisionView({
  reaction,
  running,
  temperature,
  concentration
}: {
  reaction: ReactionSimulation;
  running: boolean;
  temperature: number;
  concentration: number;
}) {
  const speed = Math.max(0.5, temperature / 40);
  const count = Math.round(12 + concentration * 8);
  return (
    <svg viewBox="0 0 760 340" className="h-[340px] w-full rounded-lg border border-border bg-slate-950">
      <text x="36" y="34" fill="#e2e8f0" fontSize="15">Molecular collision view: temperature changes particle speed; concentration changes collision frequency.</text>
      {Array.from({ length: count }, (_, index) => {
        const x = 60 + ((index * 73) % 640);
        const y = 70 + ((index * 47) % 210);
        const dx = running ? Math.cos(index) * 24 * speed : 0;
        const dy = running ? Math.sin(index * 1.7) * 18 * speed : 0;
        return (
          <g key={index}>
            <circle cx={x} cy={y} r="10" fill={index % 2 ? "#38bdf8" : "#f97316"}>
              {running ? <animate attributeName="cx" values={`${x};${x + dx};${x}`} dur={`${Math.max(0.6, 2.4 / speed)}s`} repeatCount="indefinite" /> : null}
              {running ? <animate attributeName="cy" values={`${y};${y + dy};${y}`} dur={`${Math.max(0.6, 2.2 / speed)}s`} repeatCount="indefinite" /> : null}
            </circle>
          </g>
        );
      })}
      {running ? (
        <g>
          <path d="M110 286 C220 250 310 288 410 246 S590 252 690 210" stroke="#facc15" strokeWidth="4" fill="none" strokeDasharray="8 8">
            <animate attributeName="stroke-dashoffset" values="0;32" dur="1s" repeatCount="indefinite" />
          </path>
          <text x="380" y="318" fill="#fde68a" textAnchor="middle" fontSize="14">{reaction.products.map((item) => item.formula).join(" + ")} forming</text>
        </g>
      ) : null}
    </svg>
  );
}
