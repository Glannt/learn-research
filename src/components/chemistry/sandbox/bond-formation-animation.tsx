import type { LabItem } from "@/components/chemistry/sandbox/drag-drop-lab-canvas";

export function BondFormationAnimation({
  atoms,
  formula,
  bondKind
}: {
  atoms: LabItem[];
  formula?: string;
  bondKind?: string;
}) {
  const centerX = 360;
  const centerY = 170;
  return (
    <svg viewBox="0 0 720 320" className="h-[320px] w-full rounded-md bg-slate-950">
      {atoms.map((atom, index) => {
        const angle = atoms.length <= 1 ? 0 : (index / atoms.length) * Math.PI * 2;
        const linked = Boolean(formula);
        const radius = linked ? 78 : 128;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        return (
          <g key={`${atom.id}-${index}`}>
            {linked ? <line x1={centerX} y1={centerY} x2={x} y2={y} stroke="#cbd5e1" strokeWidth="3" opacity="0.8" /> : null}
            <circle cx={x} cy={y} r="34" fill={atom.color ?? "#38bdf8"} opacity="0.95">
              <animate attributeName="r" values="30;36;34" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <text x={x} y={y + 8} fill="#0f172a" fontSize="20" fontWeight="700" textAnchor="middle">{atom.label}</text>
            {Array.from({ length: 4 }, (_, electron) => {
              const ea = (electron / 4) * Math.PI * 2 + index;
              return <circle key={electron} cx={x + Math.cos(ea) * 48} cy={y + Math.sin(ea) * 48} r="4" fill="#fde68a" />;
            })}
          </g>
        );
      })}
      {formula ? (
        <g>
          <circle cx={centerX} cy={centerY} r="44" fill="#22c55e" opacity="0.18" />
          <text x={centerX} y={centerY + 8} fill="#bbf7d0" fontSize="28" fontWeight="700" textAnchor="middle">{formula}</text>
          <text x={centerX} y="294" fill="#cbd5e1" fontSize="14" textAnchor="middle">{bondKind}</text>
        </g>
      ) : (
        <text x={centerX} y="294" fill="#cbd5e1" fontSize="14" textAnchor="middle">Drag compatible atoms to form bonds</text>
      )}
    </svg>
  );
}
