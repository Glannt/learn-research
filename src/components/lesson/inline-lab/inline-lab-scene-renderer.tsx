"use client";

import type { FormulaDetail, InlineLabObject, LabParameterBinding, LessonInlineLab } from "@/types";
import { FormulaMath } from "@/components/formula/formula-math";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";

type SceneProps = {
  lab: LessonInlineLab;
  formulaDetails: FormulaDetail[];
  activeObjectIds: string[];
  activeSymbols: string[];
  selectedObjectId?: string;
  onSelectObject?: (objectId: string) => void;
};

/* ── Colour helpers ── */

function objectFillColor(type: InlineLabObject["type"]) {
  if (type === "atom" || type === "electron" || type === "molecule") return "#10b981";
  if (type === "bond") return "#fb923c";
  if (type === "car" || type === "speedometer" || type === "ruler") return "#3b82f6";
  if (type === "force-arrow" || type === "pendulum") return "#8b5cf6";
  if (type === "beaker" || type === "solution" || type === "ph-meter" || type === "gas-container" || type === "gas-particle") return "#06b6d4";
  return "#64748b";
}

function objectTone(object: InlineLabObject) {
  if (object.type === "atom" || object.type === "electron" || object.type === "molecule") return "fill-emerald-500 stroke-emerald-900";
  if (object.type === "bond") return "fill-orange-400 stroke-orange-800";
  if (object.type === "car" || object.type === "speedometer" || object.type === "ruler") return "fill-blue-500 stroke-blue-900";
  if (object.type === "force-arrow" || object.type === "pendulum") return "fill-violet-500 stroke-violet-900";
  if (object.type === "beaker" || object.type === "solution" || object.type === "ph-meter") return "fill-cyan-500 stroke-cyan-900";
  return "fill-slate-500 stroke-slate-900";
}

function badgeBg(type: InlineLabObject["type"]) {
  if (type === "atom" || type === "electron" || type === "molecule") return "#065f46";
  if (type === "bond") return "#9a3412";
  if (type === "car" || type === "speedometer" || type === "ruler") return "#1e3a5f";
  if (type === "force-arrow" || type === "pendulum") return "#4c1d95";
  if (type === "beaker" || type === "solution" || type === "ph-meter" || type === "gas-container" || type === "gas-particle") return "#164e63";
  return "#334155";
}

/* ── Scene Object — shape + coloured numbered badge, NO text label ── */

function SceneObject({ object, active, selected, onSelect, index }: {
  object: InlineLabObject;
  active: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  index: number;
}) {
  const x = object.position.x;
  const y = object.position.y;
  const tone = objectTone(object);
  const bg = badgeBg(object.type);

  return (
    <g className="cursor-pointer" onClick={() => onSelect(object.id)} role="button" aria-label={object.label}>
      <circle
        cx={x} cy={y}
        r={active || selected ? 34 : 27}
        className={cn("opacity-15", active || selected ? "fill-amber-400" : "fill-transparent")}
      />

      {object.type === "car" ? (
        <g>
          <rect x={x - 42} y={y - 22} width="84" height="34" rx="8" className={tone} strokeWidth="2" />
          <circle cx={x - 24} cy={y + 17} r="10" className="fill-neutral-950 stroke-neutral-50" />
          <circle cx={x + 25} cy={y + 17} r="10" className="fill-neutral-950 stroke-neutral-50" />
          <path d={`M ${x - 70} ${y + 18} C ${x - 105} ${y + 18}, ${x - 118} ${y + 5}, ${x - 132} ${y + 16}`} className="fill-none stroke-blue-300" strokeWidth="3" strokeDasharray="5 8" />
        </g>
      ) : object.type === "ruler" ? (
        <g>
          <rect x={x - 78} y={y - 12} width="156" height="24" rx="6" className="fill-amber-200 stroke-amber-800" />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={x - 68 + i * 17} y1={y - 12} x2={x - 68 + i * 17} y2={y + 8} className="stroke-amber-900" strokeWidth="2" />
          ))}
        </g>
      ) : object.type === "clock" || object.type === "speedometer" || object.type === "pressure-gauge" || object.type === "ph-meter" ? (
        <g>
          <circle cx={x} cy={y} r="30" className="fill-slate-900 stroke-slate-200" strokeWidth="2" />
          <line x1={x} y1={y} x2={x + 18} y2={y - 12} className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
          <circle cx={x} cy={y} r="4" className="fill-primary" />
        </g>
      ) : object.type === "pendulum" ? (
        <g>
          <line x1={x} y1={y - 55} x2={x + 34} y2={y + 30} className="stroke-violet-700" strokeWidth="3" />
          <circle cx={x + 34} cy={y + 30} r="22" className="fill-violet-500 stroke-violet-900" />
          <path d={`M ${x - 45} ${y - 10} Q ${x} ${y - 38} ${x + 44} ${y - 10}`} className="fill-none stroke-violet-300" strokeWidth="3" strokeDasharray="6 6" />
        </g>
      ) : object.type === "force-arrow" ? (
        <g>
          <line x1={x - 38} y1={y} x2={x + 36} y2={y} className="stroke-violet-500" strokeWidth="7" strokeLinecap="round" />
          <path d={`M ${x + 36} ${y} l -16 -12 v 24 z`} className="fill-violet-500" />
        </g>
      ) : object.type === "beaker" || object.type === "gas-container" ? (
        <g>
          <path d={`M ${x - 42} ${y - 55} L ${x - 30} ${y + 48} L ${x + 30} ${y + 48} L ${x + 42} ${y - 55}`} className="fill-cyan-100/60 stroke-cyan-800" strokeWidth="3" />
          <path d={`M ${x - 28} ${y + 15} Q ${x} ${y + 2} ${x + 28} ${y + 15} L ${x + 24} ${y + 42} L ${x - 24} ${y + 42} Z`} className="fill-cyan-400/50" />
        </g>
      ) : object.type === "solution" || object.type === "gas-particle" ? (
        <g>
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={x - 32 + (i % 3) * 30} cy={y - 22 + Math.floor(i / 3) * 24} r="7" className="fill-cyan-500 stroke-cyan-900" />
          ))}
        </g>
      ) : object.type === "bond" ? (
        <g>
          <line x1={x - 42} y1={y} x2={x + 42} y2={y} className="stroke-orange-500" strokeWidth="9" strokeLinecap="round" />
          <circle cx={x - 50} cy={y} r="19" className="fill-emerald-500 stroke-emerald-900" />
          <circle cx={x + 50} cy={y} r="19" className="fill-emerald-500 stroke-emerald-900" />
        </g>
      ) : object.type === "electron" ? (
        <g>
          <circle cx={x} cy={y} r="26" className="fill-transparent stroke-emerald-700" strokeDasharray="5 5" />
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (Math.PI * 2 * i) / 6;
            return <circle key={i} cx={x + Math.cos(angle) * 34} cy={y + Math.sin(angle) * 22} r="5" className="fill-sky-400" />;
          })}
        </g>
      ) : (
        <circle cx={x} cy={y} r="28" className={tone} strokeWidth="2" />
      )}

      {/* Coloured numbered badge */}
      <circle cx={x + 30} cy={y - 30} r="12" fill={bg} stroke="#1e293b" strokeWidth="1.5" />
      <text x={x + 30} y={y - 26} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{index + 1}</text>
    </g>
  );
}

/* ── Binding lines ── */

function bindingLine(binding: LabParameterBinding, objects: InlineLabObject[]) {
  const fromId = binding.sourceObjectId === "formula-node" ? "formula-node" : binding.sourceObjectId;
  const toId = binding.targetObjectId === "formula-node" ? "formula-node" : binding.targetObjectId;
  const from = fromId === "formula-node" ? { x: 720, y: 180 } : objects.find((o) => o.id === fromId)?.position;
  const to = toId === "formula-node" ? { x: 720, y: 180 } : objects.find((o) => o.id === toId)?.position;
  if (!from || !to) return null;

  return (
    <g key={`${binding.formulaId}-${binding.parameterSymbol}-${binding.flowOrder}`}>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="stroke-primary/40" strokeWidth="1.5" strokeDasharray="5 7" />
      <circle cx={(from.x + to.x) / 2} cy={(from.y + to.y) / 2} r="12" className="fill-slate-900 stroke-primary/70" strokeWidth="1.2" />
      <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 + 4} textAnchor="middle" className="fill-primary text-[10px] font-bold">
        {binding.parameterSymbol}
      </text>
    </g>
  );
}

/* ── Mini legend icon ── */

function LegendIcon({ type }: { type: InlineLabObject["type"] }) {
  const fill = objectFillColor(type);
  const s = 16;

  if (type === "car") return (
    <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
      <rect x="2" y="4" width="12" height="6" rx="2.5" fill={fill} />
      <circle cx="5" cy="12" r="1.8" fill="#0a0a0a" stroke="#e5e5e5" strokeWidth="0.5" />
      <circle cx="11" cy="12" r="1.8" fill="#0a0a0a" stroke="#e5e5e5" strokeWidth="0.5" />
    </svg>
  );
  if (type === "ruler") return (
    <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
      <rect x="1" y="5" width="14" height="6" rx="1.2" fill="#fde68a" stroke="#92400e" strokeWidth="0.7" />
      {[4, 7, 10, 13].map(px => <line key={px} x1={px} y1="5" x2={px} y2="9" stroke="#92400e" strokeWidth="0.7" />)}
    </svg>
  );
  if (type === "clock" || type === "speedometer" || type === "pressure-gauge" || type === "ph-meter") return (
    <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
      <circle cx="8" cy="8" r="6" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="8" y1="8" x2="12" y2="5" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="8" r="1.2" fill="#3b82f6" />
    </svg>
  );
  if (type === "pendulum") return (
    <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
      <line x1="8" y1="2" x2="11" y2="11" stroke="#7c3aed" strokeWidth="1.2" />
      <circle cx="11" cy="11" r="3" fill={fill} />
    </svg>
  );
  if (type === "force-arrow") return (
    <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
      <line x1="2" y1="8" x2="11" y2="8" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M11,8 l-3.5,-2.5 v5 z" fill={fill} />
    </svg>
  );
  if (type === "beaker" || type === "gas-container") return (
    <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
      <path d="M4,2 L3,14 L13,14 L12,2" fill="rgba(6,182,212,0.2)" stroke="#155e75" strokeWidth="0.8" />
      <path d="M4,10 Q8,8 12,10 L12,14 L4,14 Z" fill="rgba(6,182,212,0.35)" />
    </svg>
  );
  if (type === "solution" || type === "gas-particle") return (
    <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
      {[{cx:4,cy:4},{cx:8,cy:3},{cx:12,cy:5},{cx:3,cy:9},{cx:8,cy:8},{cx:13,cy:10},{cx:5,cy:13},{cx:9,cy:13},{cx:12,cy:14}].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="1.4" fill={fill} />
      ))}
    </svg>
  );
  if (type === "bond") return (
    <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
      <line x1="2" y1="8" x2="14" y2="8" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="2" cy="8" r="2.5" fill="#10b981" />
      <circle cx="14" cy="8" r="2.5" fill="#10b981" />
    </svg>
  );
  if (type === "electron") return (
    <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
      <circle cx="8" cy="8" r="5" fill="none" stroke="#047857" strokeDasharray="2 2" strokeWidth="0.8" />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return <circle key={i} cx={8 + Math.cos(rad) * 5} cy={8 + Math.sin(rad) * 5} r="1.2" fill="#38bdf8" />;
      })}
    </svg>
  );
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
      <circle cx="8" cy="8" r="6" fill={fill} opacity="0.8" />
    </svg>
  );
}

/* ── Exported helpers ── */

export function InlineLabAnnotation({ object }: { object: InlineLabObject }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-sm">
      <p className="font-semibold">{object.label}</p>
      <p className="mt-1 text-muted-foreground">{object.description}</p>
      <p className="mt-2 text-xs text-muted-foreground">Tham số: {object.boundParameters.join(", ") || "không có"}</p>
    </div>
  );
}

export function VisualObjectHighlighter({ objectIds }: { objectIds: string[] }) {
  if (!objectIds.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {objectIds.map((objectId) => <span key={objectId} className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-950 dark:bg-amber-300/20 dark:text-amber-100">{objectId}</span>)}
    </div>
  );
}

/* ── Main renderer ── */

export function InlineLabSceneRenderer({ lab, formulaDetails, activeObjectIds, activeSymbols, selectedObjectId, onSelectObject }: SceneProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      {/* ── SVG Scene ── */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-slate-950 text-white shadow-lg">
        <svg viewBox="0 0 880 380" className="block w-full h-auto transition-all duration-300 font-sans" style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
          <rect width="880" height="380" rx="16" className="fill-slate-950" />
          <path d="M 50 330 C 170 290, 240 350, 380 310 S 630 290, 800 335" className="fill-none stroke-slate-800/60" strokeWidth="2" />

          {/* Binding lines */}
          {lab.parameterBindings.map((binding) => bindingLine(binding, lab.visualScene.objects))}

          {/* Formula node */}
          <g>
            <rect x="640" y="115" width="160" height="130" rx="16" className="fill-slate-900 stroke-primary/50" strokeWidth="1.5" />
            <text x="720" y="140" textAnchor="middle" className="fill-slate-400 text-[11px] font-medium">{t("inlineLabFormulaNode")}</text>
            <foreignObject x="652" y="148" width="136" height="85">
              <div className="flex h-full flex-col items-center justify-center gap-1.5 rounded-lg bg-slate-950/60 p-2 text-center text-slate-100">
                {formulaDetails.slice(0, 2).map((detail) => (
                  <FormulaMath key={detail.id} latex={detail.latex} inline />
                ))}
              </div>
            </foreignObject>
          </g>

          {/* Objects */}
          {lab.visualScene.objects.map((object, index) => (
            <SceneObject
              key={object.id}
              object={object}
              active={activeObjectIds.includes(object.id) || object.boundParameters.some((symbol) => activeSymbols.includes(symbol))}
              selected={selectedObjectId === object.id}
              onSelect={(objectId) => onSelectObject?.(objectId)}
              index={index}
            />
          ))}
        </svg>
      </div>

      {/* ── Legend strip BELOW SVG ── */}
      <div className="flex flex-wrap items-stretch gap-1.5 rounded-lg border border-border bg-card/80 px-2 py-1.5 backdrop-blur-sm">
        {lab.visualScene.objects.map((object, index) => {
          const isSelected = selectedObjectId === object.id;
          return (
            <button
              key={object.id}
              type="button"
              className={cn(
                "group flex items-center gap-1.5 shrink-0 rounded-md px-2.5 py-1.5 text-left transition-all duration-150",
                "border border-transparent hover:border-slate-700 hover:bg-muted/60",
                isSelected && "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
              )}
              onClick={() => onSelectObject?.(object.id)}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: badgeBg(object.type) }}
              >
                {index + 1}
              </span>
              <LegendIcon type={object.type} />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-foreground leading-tight whitespace-nowrap">{object.label}</p>
                {object.boundParameters.length > 0 && (
                  <p className="text-[9px] text-muted-foreground font-mono leading-tight whitespace-nowrap">{object.boundParameters.join(", ")}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
