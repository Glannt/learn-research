import type { VisualSimulation } from "@/features/visual-simulation/models/visual-simulation.types";

const roleColor = {
  input: "#38bdf8",
  process: "#818cf8",
  output: "#22c55e",
  warning: "#f97316",
  measurement: "#facc15"
};

export function FaradayInduction2D({
  visual,
  phase,
  magnetX,
  current,
  meterDeflection,
  showLabels,
  showField,
  showCurrent,
  showFormula,
  failureMode
}: {
  visual: VisualSimulation;
  phase: number;
  magnetX: number;
  current: number;
  meterDeflection: number;
  showLabels: boolean;
  showField: boolean;
  showCurrent: boolean;
  showFormula: boolean;
  failureMode: string;
}) {
  const markerId = "faraday-arrow";
  const reverse = current < 0;
  const magnetScreenX = 170 + magnetX * 95;
  const needleAngle = meterDeflection * 42;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-slate-950 text-white">
      <svg viewBox="0 0 960 560" className="aspect-[16/9] w-full">
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0l10 5-10 5z" fill="currentColor" />
          </marker>
          <pattern id="faraday-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="rgba(148,163,184,.12)" />
          </pattern>
        </defs>
        <rect width="960" height="560" fill="#020617" />
        <rect width="960" height="560" fill="url(#faraday-grid)" />

        <foreignObject x="28" y="22" width="610" height="76">
          <div className="rounded-xl border border-white/10 bg-white/95 p-3 text-slate-950 shadow-xl">
            <p className="font-semibold">{visual.title}</p>
            <p className="text-xs text-slate-600">Motion changes magnetic flux, Faraday law induces voltage, a closed circuit carries current.</p>
          </div>
        </foreignObject>

        <g transform={`translate(${magnetScreenX} 230)`}>
          <rect x="-86" y="-36" width="86" height="72" rx="12" fill="#2563eb" stroke="#bfdbfe" strokeWidth="4" />
          <rect x="0" y="-36" width="86" height="72" rx="12" fill="#ef4444" stroke="#fecaca" strokeWidth="4" />
          <text x="-53" y="10" fontSize="22" fontWeight="800" fill="white">N</text>
          <text x="33" y="10" fontSize="22" fontWeight="800" fill="white">S</text>
        </g>

        <path d={Math.cos(phase) >= 0 ? "M130 150 H250" : "M250 150 H130"} stroke="#f97316" strokeWidth="5" markerEnd={`url(#${markerId})`} />
        <text x="138" y="135" fill="#fdba74" fontSize="14" fontWeight="700">magnet speed v</text>

        {showField ? (
          <g color={roleColor.input} opacity={failureMode === "weak-field" ? 0.35 : 0.85}>
            {[184, 212, 240, 268].map((y) => (
              <line key={y} x1={magnetScreenX + 70} y1={y} x2="420" y2={y} stroke="currentColor" strokeWidth="4" markerEnd={`url(#${markerId})`} />
            ))}
            <text x="285" y="178" fill={roleColor.input} fontSize="14" fontWeight="700">B field through coil</text>
          </g>
        ) : null}

        <g transform="translate(450 230)">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <ellipse key={index} cx={index * 8 - 20} cy="0" rx="34" ry="92" fill="none" stroke="#f59e0b" strokeWidth="5" />
          ))}
          <line x1="-36" y1="-105" x2="-36" y2="-150" stroke="#94a3b8" strokeWidth="5" />
          <line x1="36" y1="105" x2="36" y2="150" stroke="#94a3b8" strokeWidth="5" />
          <text x="-38" y="128" fill="#fef3c7" fontSize="15" fontWeight="700">coil N turns</text>
        </g>

        <path d="M414 80 H716 V310 H610" stroke="#94a3b8" strokeWidth="5" fill="none" opacity={failureMode === "open-circuit" ? 0.28 : 1} />
        <path d="M486 380 H716 V310" stroke="#94a3b8" strokeWidth="5" fill="none" opacity={failureMode === "open-circuit" ? 0.28 : 1} />
        {failureMode === "open-circuit" ? (
          <g>
            <circle cx="610" cy="310" r="16" fill="#ef4444" />
            <text x="578" y="344" fill="#fb923c" fontSize="13">open circuit</text>
          </g>
        ) : null}

        {showCurrent ? (
          <g color={reverse ? "#fb7185" : "#22c55e"} opacity={failureMode === "open-circuit" ? 0.18 : 1}>
            <path d={reverse ? "M690 80 H500" : "M500 80 H690"} stroke="currentColor" strokeWidth="5" markerEnd={`url(#${markerId})`} />
            <path d={reverse ? "M540 380 H690" : "M690 380 H540"} stroke="currentColor" strokeWidth="5" markerEnd={`url(#${markerId})`} />
            <text x="552" y="62" fill="currentColor" fontSize="14" fontWeight="700">I reverses when motion reverses</text>
          </g>
        ) : null}

        <g transform="translate(760 270)">
          <circle cx="0" cy="0" r="78" fill="#0f172a" stroke="#334155" strokeWidth="4" />
          <path d="M-46 30 A58 58 0 0 1 46 30" fill="none" stroke="#475569" strokeWidth="4" />
          <line x1="0" y1="0" x2="0" y2="-52" stroke="#facc15" strokeWidth="5" strokeLinecap="round" transform={`rotate(${needleAngle})`} />
          <circle cx="0" cy="0" r="8" fill="#facc15" />
          <text x="-54" y="106" fill={roleColor.measurement} fontSize="14" fontWeight="700">galvanometer</text>
        </g>

        <g transform="translate(80 455)">
          <text x="0" y="-16" fill="#cbd5e1" fontSize="13" fontWeight="700">ByteByteGo-style flow</text>
          {["Move magnet", "Change flux", "Induce voltage", "Current deflects meter"].map((label, index) => (
            <g key={label} transform={`translate(${index * 190} 0)`}>
              <rect width="150" height="44" rx="10" fill={index === 0 ? "#082f49" : index === 1 ? "#312e81" : index === 2 ? "#713f12" : "#064e3b"} stroke="rgba(255,255,255,.16)" />
              <text x="75" y="27" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{label}</text>
              {index < 3 ? <path d="M158 22 H184" stroke="#94a3b8" strokeWidth="4" markerEnd={`url(#${markerId})`} /> : null}
            </g>
          ))}
        </g>

        {showLabels ? (
          <>
            {visual.diagram2D.objects.map((object) => (
              <foreignObject key={object.id} x={object.position.x - 28} y={object.position.y - 64} width="174" height="58">
                <div className="rounded-lg border border-white/15 bg-slate-900/90 px-2 py-1 text-[11px] shadow-lg">
                  <p className="font-semibold" style={{ color: roleColor[object.colorRole ?? "process"] }}>{object.label}</p>
                  <p className="line-clamp-1 text-slate-300">{object.description}</p>
                </div>
              </foreignObject>
            ))}
          </>
        ) : null}

        {showFormula ? (
          <foreignObject x="600" y="32" width="330" height="92">
            <div className="rounded-xl border border-white/10 bg-white/95 p-3 text-slate-950 shadow-xl">
              <p className="font-mono text-sm">Phi = B A cos(theta)</p>
              <p className="font-mono text-sm">epsilon = -N dPhi/dt, I = epsilon / R</p>
              <p className="mt-1 text-xs text-slate-600">No changing flux means no sustained induced current.</p>
            </div>
          </foreignObject>
        ) : null}
      </svg>
    </div>
  );
}
