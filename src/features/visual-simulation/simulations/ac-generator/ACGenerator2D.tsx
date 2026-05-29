import type { VisualSimulation } from "@/features/visual-simulation/models/visual-simulation.types";

const roleColor = {
  input: "#38bdf8",
  process: "#818cf8",
  output: "#22c55e",
  warning: "#f97316",
  measurement: "#facc15"
};

function Snapshot({ x, degree, active }: { x: number; degree: number; active: boolean }) {
  const value = Math.sin((degree / 180) * Math.PI);
  return (
    <g transform={`translate(${x} 486)`}>
      <rect x="-46" y="-28" width="92" height="56" rx="10" fill={active ? "rgba(249,115,22,.22)" : "rgba(15,23,42,.92)"} stroke={active ? "#f97316" : "#334155"} />
      <g transform={`rotate(${degree})`}>
        <rect x="-22" y="-20" width="44" height="40" rx="5" fill="rgba(129,140,248,.14)" stroke="#f59e0b" strokeWidth="4" />
      </g>
      <text x="0" y="44" textAnchor="middle" fill="#cbd5e1" fontSize="12">{degree} deg</text>
      <text x="0" y="61" textAnchor="middle" fill={Math.abs(value) < 0.01 ? "#facc15" : value > 0 ? "#22c55e" : "#fb7185"} fontSize="11">
        {Math.abs(value) < 0.01 ? "I near 0" : value > 0 ? "+I max" : "-I max"}
      </text>
    </g>
  );
}

export function ACGenerator2D({
  visual,
  angle,
  current,
  lampBrightness,
  showLabels,
  showField,
  showCurrent,
  showFormula,
  failureMode
}: {
  visual: VisualSimulation;
  angle: number;
  current: number;
  lampBrightness: number;
  showLabels: boolean;
  showField: boolean;
  showCurrent: boolean;
  showFormula: boolean;
  failureMode: string;
}) {
  const markerId = "ac-generator-2d-arrow";
  const reverse = current < 0;
  const coilRotation = (angle * 180) / Math.PI;
  const activeDegree = Math.round(((angle % (Math.PI * 2)) * 180) / Math.PI);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-slate-950 text-white">
      <svg viewBox="0 0 960 560" className="aspect-[16/9] w-full">
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0l10 5-10 5z" fill="currentColor" />
          </marker>
          <pattern id="ac-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="rgba(148,163,184,.12)" />
          </pattern>
        </defs>
        <rect width="960" height="560" fill="#020617" />
        <rect width="960" height="560" fill="url(#ac-grid)" />

        <foreignObject x="28" y="22" width="555" height="76">
          <div className="rounded-xl border border-white/10 bg-white/95 p-3 text-slate-950 shadow-xl">
            <p className="font-semibold">{visual.title}</p>
            <p className="text-xs text-slate-600">Rotation &rarr; changing magnetic flux &rarr; induced voltage &rarr; alternating current &rarr; lamp brightness</p>
          </div>
        </foreignObject>

        <rect x="82" y="150" width="108" height="212" rx="18" fill="#2563eb" stroke="#bfdbfe" strokeWidth="4" />
        <text x="122" y="264" fontSize="42" fontWeight="800" fill="white">N</text>
        <rect x="500" y="150" width="108" height="212" rx="18" fill="#ef4444" stroke="#fecaca" strokeWidth="4" />
        <text x="542" y="264" fontSize="42" fontWeight="800" fill="white">S</text>

        {showField ? (
          <g color={roleColor.input}>
            {[184, 224, 264, 304].map((y) => (
              <line key={y} x1="204" y1={y} x2="488" y2={y} stroke="currentColor" strokeWidth="4" markerEnd={`url(#${markerId})`} opacity="0.74" />
            ))}
            <text x="312" y="178" fill={roleColor.input} fontSize="15" fontWeight="700">B field from N to S</text>
          </g>
        ) : null}

        <g transform={`translate(350 256) rotate(${coilRotation})`}>
          <rect x="-68" y="-92" width="136" height="184" rx="12" fill="rgba(129,140,248,.12)" stroke="#f59e0b" strokeWidth="8" />
          <line x1="-68" y1="0" x2="-108" y2="0" stroke="#f59e0b" strokeWidth="8" />
          <line x1="68" y1="0" x2="108" y2="0" stroke="#f59e0b" strokeWidth="8" />
          <text x="-34" y="8" fill="#fef3c7" fontSize="16" fontWeight="700">coil</text>
        </g>

        <path d="M278 126 A96 96 0 0 1 422 126" fill="none" stroke="#f97316" strokeWidth="5" strokeDasharray="12 10" markerEnd={`url(#${markerId})`} />
        <text x="302" y="112" fill="#fdba74" fontSize="15" fontWeight="700">omega rotation</text>

        <g transform="translate(350 400)">
          <circle cx="-32" cy="0" r="22" fill="none" stroke="#f59e0b" strokeWidth="7" />
          <circle cx="32" cy="0" r="22" fill="none" stroke="#f59e0b" strokeWidth="7" />
          <rect x="-78" y="42" width="42" height="18" rx="5" fill={failureMode === "brush-disconnected" ? "#ef4444" : "#cbd5e1"} />
          <rect x="36" y="42" width="42" height="18" rx="5" fill={failureMode === "brush-disconnected" ? "#ef4444" : "#cbd5e1"} />
          {failureMode === "brush-disconnected" ? <text x="-78" y="84" fill="#fb923c" fontSize="13">open circuit</text> : null}
        </g>

        <path d="M272 444 H160 V326" stroke="#94a3b8" strokeWidth="5" fill="none" />
        <path d="M428 444 H720 V326" stroke="#94a3b8" strokeWidth="5" fill="none" />
        <path d="M720 326 C720 278 790 278 790 326 C790 374 720 374 720 326" fill={`rgba(250,204,21,${0.12 + lampBrightness * 0.55})`} stroke="#facc15" strokeWidth="5" />
        <path d="M737 326 q18 -34 36 0 q-18 34 -36 0" fill="none" stroke="#fef3c7" strokeWidth="3" />
        <text x="698" y="410" fill={roleColor.output} fontSize="14" fontWeight="700">Lamp / R load</text>

        {showCurrent ? (
          <g color={reverse ? "#fb7185" : "#22c55e"} opacity={failureMode === "brush-disconnected" ? 0.25 : 1}>
            <path d={reverse ? "M690 444 H454" : "M454 444 H690"} stroke="currentColor" strokeWidth="5" markerEnd={`url(#${markerId})`} />
            <path d={reverse ? "M174 326 V424" : "M174 424 V326"} stroke="currentColor" strokeWidth="5" markerEnd={`url(#${markerId})`} />
            <text x="490" y="430" fill="currentColor" fontSize="14" fontWeight="700">I(t) reverses each half turn</text>
          </g>
        ) : null}

        <g transform="translate(672 72)">
          <rect width="234" height="136" rx="16" fill="#0f172a" stroke="#334155" />
          <path d="M16 68 H218" stroke="#475569" strokeWidth="2" />
          <path
            d={Array.from({ length: 80 }, (_, i) => {
              const x = 16 + (i / 79) * 202;
              const y = 68 - Math.sin((i / 79) * Math.PI * 2) * 42;
              return `${i === 0 ? "M" : "L"}${x} ${y}`;
            }).join(" ")}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
          />
          <line x1={16 + ((angle % (Math.PI * 2)) / (Math.PI * 2)) * 202} y1="18" x2={16 + ((angle % (Math.PI * 2)) / (Math.PI * 2)) * 202} y2="118" stroke="#f97316" strokeWidth="3" />
          <text x="16" y="128" fill="#facc15" fontSize="12">AC waveform</text>
        </g>

        <g>
          {[0, 90, 180, 270].map((degree, index) => (
            <Snapshot key={degree} x={132 + index * 126} degree={degree} active={Math.abs(((activeDegree - degree + 540) % 360) - 180) < 28} />
          ))}
          <text x="80" y="458" fill="#cbd5e1" fontSize="13" fontWeight="700">Coil snapshots</text>
        </g>

        {showLabels ? (
          <>
            {visual.diagram2D.objects.map((object) => (
              <foreignObject key={object.id} x={object.position.x - 26} y={object.position.y - 58} width="160" height="54">
                <div className="rounded-lg border border-white/15 bg-slate-900/90 px-2 py-1 text-[11px] shadow-lg">
                  <p className="font-semibold" style={{ color: roleColor[object.colorRole ?? "process"] }}>{object.label}</p>
                  <p className="line-clamp-1 text-slate-300">{object.description}</p>
                </div>
              </foreignObject>
            ))}
          </>
        ) : null}

        {showFormula ? (
          <foreignObject x="545" y="458" width="380" height="76">
            <div className="rounded-xl border border-white/10 bg-white/95 p-3 text-slate-950 shadow-xl">
              <p className="font-mono text-sm">Phi = B A cos(theta) &rarr; epsilon(t) ~= N B A omega sin(omega t) &rarr; I = epsilon / R</p>
              <p className="mt-1 text-xs text-slate-600">B maps to field lines, omega to rotation, R to the lamp/load.</p>
            </div>
          </foreignObject>
        ) : null}
      </svg>
    </div>
  );
}
