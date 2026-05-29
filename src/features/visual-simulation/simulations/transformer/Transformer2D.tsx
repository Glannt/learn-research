import type { VisualSimulation } from "@/features/visual-simulation/models/visual-simulation.types";

const roleColor = {
  input: "#38bdf8",
  process: "#818cf8",
  output: "#22c55e",
  warning: "#f97316",
  measurement: "#facc15"
};

export function Transformer2D({
  visual,
  phase,
  primaryTurns,
  secondaryTurns,
  secondaryVoltage,
  brightness,
  showLabels,
  showField,
  showCurrent,
  showFormula,
  failureMode
}: {
  visual: VisualSimulation;
  phase: number;
  primaryTurns: number;
  secondaryTurns: number;
  secondaryVoltage: number;
  brightness: number;
  showLabels: boolean;
  showField: boolean;
  showCurrent: boolean;
  showFormula: boolean;
  failureMode: string;
}) {
  const markerId = "transformer-arrow";
  const reverse = Math.sin(phase) < 0;
  const primaryVisibleTurns = Math.max(4, Math.min(10, Math.round(primaryTurns / 7)));
  const secondaryVisibleTurns = Math.max(4, Math.min(12, Math.round(secondaryTurns / 8)));
  const ratio = secondaryTurns / Math.max(1, primaryTurns);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-slate-950 text-white">
      <svg viewBox="0 0 960 560" className="aspect-[16/9] w-full">
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0l10 5-10 5z" fill="currentColor" />
          </marker>
          <pattern id="transformer-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="rgba(148,163,184,.12)" />
          </pattern>
        </defs>
        <rect width="960" height="560" fill="#020617" />
        <rect width="960" height="560" fill="url(#transformer-grid)" />

        <foreignObject x="28" y="22" width="610" height="76">
          <div className="rounded-xl border border-white/10 bg-white/95 p-3 text-slate-950 shadow-xl">
            <p className="font-semibold">{visual.title}</p>
            <p className="text-xs text-slate-600">AC input creates changing core flux, which induces secondary voltage by the turn ratio.</p>
          </div>
        </foreignObject>

        <rect x="270" y="145" width="270" height="210" rx="24" fill="rgba(100,116,139,.16)" stroke="#64748b" strokeWidth="18" />
        <rect x="335" y="200" width="140" height="100" rx="16" fill="#020617" stroke="#1e293b" strokeWidth="4" />

        <g transform="translate(255 250)">
          {Array.from({ length: primaryVisibleTurns }, (_, index) => (
            <ellipse key={index} cx={index * 9 - 34} cy="0" rx="30" ry="92" fill="none" stroke="#f59e0b" strokeWidth="5" />
          ))}
          <text x="-62" y="120" fill="#38bdf8" fontSize="14" fontWeight="700">Primary Np={primaryTurns}</text>
        </g>

        <g transform="translate(550 250)">
          {Array.from({ length: secondaryVisibleTurns }, (_, index) => (
            <ellipse key={index} cx={index * 8 - 38} cy="0" rx="30" ry="92" fill="none" stroke="#f59e0b" strokeWidth="5" />
          ))}
          <text x="-54" y="120" fill="#22c55e" fontSize="14" fontWeight="700">Secondary Ns={secondaryTurns}</text>
        </g>

        {showField ? (
          <g color={failureMode === "weak-coupling" ? "#fb923c" : roleColor.process} opacity={failureMode === "weak-coupling" ? 0.42 : 0.88}>
            {[176, 220, 264, 308].map((y, index) => (
              <path key={y} d={`M300 ${y} C360 ${y - 32} 450 ${y - 32} 512 ${y}`} fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={index % 2 ? "10 8" : undefined} markerEnd={`url(#${markerId})`} />
            ))}
            <text x="344" y="134" fill="currentColor" fontSize="14" fontWeight="700">alternating core flux</text>
          </g>
        ) : null}

        <g color={roleColor.input}>
          <path d={reverse ? "M70 250 H174" : "M174 250 H70"} stroke="currentColor" strokeWidth="5" markerEnd={`url(#${markerId})`} />
          <text x="78" y="232" fill="currentColor" fontSize="14" fontWeight="700">AC input Vp</text>
        </g>

        <path d="M650 250 H744" stroke="#94a3b8" strokeWidth="5" opacity={failureMode === "open-secondary" ? 0.28 : 1} />
        <path d="M744 250 V366 H650" stroke="#94a3b8" strokeWidth="5" fill="none" opacity={failureMode === "open-secondary" ? 0.28 : 1} />
        <path d="M770 308 C770 264 840 264 840 308 C840 352 770 352 770 308" fill={`rgba(250,204,21,${0.12 + brightness * 0.55})`} stroke="#facc15" strokeWidth="5" />
        <text x="748" y="402" fill="#22c55e" fontSize="14" fontWeight="700">Load R, Vs={secondaryVoltage.toFixed(1)} V</text>
        {failureMode === "open-secondary" ? <text x="694" y="226" fill="#fb923c" fontSize="13">open secondary</text> : null}

        {showCurrent ? (
          <g color={reverse ? "#fb7185" : "#22c55e"} opacity={failureMode === "open-secondary" ? 0.18 : 1}>
            <path d={reverse ? "M724 366 H656" : "M656 366 H724"} stroke="currentColor" strokeWidth="5" markerEnd={`url(#${markerId})`} />
            <text x="672" y="350" fill="currentColor" fontSize="13" fontWeight="700">Is alternates</text>
          </g>
        ) : null}

        <g transform="translate(80 456)">
          {["AC input", "Changing flux", "Induced Vs", "Load output"].map((label, index) => (
            <g key={label} transform={`translate(${index * 190} 0)`}>
              <rect width="150" height="44" rx="10" fill={index === 0 ? "#082f49" : index === 1 ? "#312e81" : index === 2 ? "#713f12" : "#064e3b"} stroke="rgba(255,255,255,.16)" />
              <text x="75" y="27" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{label}</text>
              {index < 3 ? <path d="M158 22 H184" stroke="#94a3b8" strokeWidth="4" markerEnd={`url(#${markerId})`} /> : null}
            </g>
          ))}
        </g>

        <foreignObject x="660" y="32" width="250" height="84">
          <div className="rounded-xl border border-white/10 bg-slate-900/92 p-3 text-white shadow-xl">
            <p className="text-xs text-slate-300">Turn ratio</p>
            <p className="font-mono text-lg">Ns/Np = {ratio.toFixed(2)}</p>
            <p className="text-xs text-slate-300">{ratio >= 1 ? "step-up voltage" : "step-down voltage"}</p>
          </div>
        </foreignObject>

        {showLabels ? (
          <>
            {visual.diagram2D.objects.map((object) => (
              <foreignObject key={object.id} x={object.position.x - 36} y={object.position.y - 64} width="176" height="58">
                <div className="rounded-lg border border-white/15 bg-slate-900/90 px-2 py-1 text-[11px] shadow-lg">
                  <p className="font-semibold" style={{ color: roleColor[object.colorRole ?? "process"] }}>{object.label}</p>
                  <p className="line-clamp-1 text-slate-300">{object.description}</p>
                </div>
              </foreignObject>
            ))}
          </>
        ) : null}

        {showFormula ? (
          <foreignObject x="40" y="110" width="360" height="76">
            <div className="rounded-xl border border-white/10 bg-white/95 p-3 text-slate-950 shadow-xl">
              <p className="font-mono text-sm">Vs / Vp ~= Ns / Np</p>
              <p className="font-mono text-sm">epsilon = -N dPhi/dt, Is = Vs / R</p>
            </div>
          </foreignObject>
        ) : null}
      </svg>
    </div>
  );
}
