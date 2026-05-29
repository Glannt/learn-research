"use client";

import { useState } from "react";
import type { Simulation } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationLayout } from "@/components/simulation/simulation-layout";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

type ConceptMode = "learn" | "practice" | "challenge";

const modeCopyKeys: Record<ConceptMode, DictionaryKey> = {
  learn: "conceptLearnCopy",
  practice: "conceptPracticeCopy",
  challenge: "conceptChallengeCopy"
};

const modeTitleKeys: Record<ConceptMode, DictionaryKey> = {
  learn: "conceptLearnGoalTitle",
  practice: "conceptPracticeGoalTitle",
  challenge: "conceptChallengeGoalTitle"
};

const modeLabelKeys: Record<ConceptMode, DictionaryKey> = {
  learn: "commonLearn",
  practice: "commonPractice",
  challenge: "commonChallenge"
};

function Legend() {
  const { t } = useI18n();
  const items: [DictionaryKey, string][] = [
    ["commonInput", "#38bdf8"],
    ["commonProcess", "#818cf8"],
    ["commonOutput", "#22c55e"],
    ["commonWarning", "#f97316"],
    ["commonMeasurement", "#facc15"]
  ];

  return (
    <div className="grid gap-2 text-xs sm:grid-cols-5">
      {items.map(([labelKey, color]) => (
        <div key={labelKey} className="flex items-center gap-2 rounded-md border border-border p-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
          <span>{t(labelKey)}</span>
        </div>
      ))}
    </div>
  );
}

function WaveParticleDiagram({ mode }: { mode: ConceptMode }) {
  const showWave = mode !== "challenge";
  const showParticle = mode !== "practice";
  const { t } = useI18n();
  return (
    <svg viewBox="0 0 900 460" className="h-[460px] w-full rounded-xl border border-border bg-slate-950 text-white">
      <defs>
        <marker id="concept-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0l10 5-10 5z" fill="currentColor" />
        </marker>
      </defs>
      <rect width="900" height="460" fill="#020617" />
      <text x="34" y="42" fill="#e2e8f0" fontSize="22" fontWeight="700">{t("conceptWaveParticleTitle")}</text>
      <text x="34" y="70" fill="#94a3b8" fontSize="14">{t("conceptWaveParticleSubtitle")}</text>

      <g color="#38bdf8">
        <circle cx="95" cy="230" r="24" fill="#38bdf8" opacity="0.28" stroke="#38bdf8" strokeWidth="4" />
        <text x="58" y="284" fill="#38bdf8" fontSize="14" fontWeight="700">{t("conceptSource")}</text>
        <path d="M130 230 H238" stroke="currentColor" strokeWidth="5" markerEnd="url(#concept-arrow)" />
      </g>

      <g>
        <rect x="270" y="125" width="30" height="210" rx="8" fill="#334155" stroke="#64748b" strokeWidth="4" />
        <rect x="270" y="176" width="30" height="38" rx="6" fill="#020617" />
        <rect x="270" y="246" width="30" height="38" rx="6" fill="#020617" />
        <text x="238" y="366" fill="#818cf8" fontSize="14" fontWeight="700">{t("conceptDoubleSlit")}</text>
      </g>

      {showWave ? (
        <g color="#818cf8" opacity="0.86">
          {[0, 1, 2, 3].map((index) => (
            <path key={index} d={`M320 ${195 + index * 14} C410 ${125 + index * 20} 510 ${125 + index * 20} 610 ${195 + index * 14}`} fill="none" stroke="currentColor" strokeWidth="3" />
          ))}
          {[0, 1, 2, 3].map((index) => (
            <path key={index + 10} d={`M320 ${265 - index * 14} C410 ${335 - index * 20} 510 ${335 - index * 20} 610 ${265 - index * 14}`} fill="none" stroke="currentColor" strokeWidth="3" />
          ))}
          <text x="420" y="116" fill="#a5b4fc" fontSize="14" fontWeight="700">{t("conceptWaveProbability")}</text>
        </g>
      ) : null}

      {showParticle ? (
        <g>
          {[180, 195, 205, 224, 240, 255, 270, 292].map((y, index) => (
            <circle key={index} cx={690 + (index % 3) * 18} cy={y} r="5" fill="#22c55e" />
          ))}
          <text x="648" y="350" fill="#22c55e" fontSize="14" fontWeight="700">{t("conceptParticleDetection")}</text>
        </g>
      ) : null}

      <g>
        <rect x="760" y="120" width="22" height="220" rx="8" fill="#0f172a" stroke="#facc15" strokeWidth="4" />
        {[150, 174, 198, 230, 262, 286, 310].map((y, index) => (
          <rect key={index} x="764" y={y} width="14" height={index === 3 ? 24 : 12} rx="4" fill="#facc15" opacity={index === 3 ? 0.95 : 0.42} />
        ))}
        <text x="724" y="372" fill="#facc15" fontSize="14" fontWeight="700">{t("conceptInterferencePattern")}</text>
      </g>

      <g color="#f97316">
        <path d="M612 230 H742" stroke="currentColor" strokeWidth="4" markerEnd="url(#concept-arrow)" />
        <text x="620" y="215" fill="#fdba74" fontSize="13">{t("conceptManyTrials")}</text>
      </g>

      <foreignObject x="34" y="390" width="820" height="52">
        <div className="rounded-lg border border-white/10 bg-white/95 p-3 text-sm text-slate-950 shadow-xl">
          {t("conceptWaveParticleSummary")}
        </div>
      </foreignObject>
    </svg>
  );
}

function ElectricFieldDiagram() {
  const { t } = useI18n();
  return (
    <svg viewBox="0 0 900 460" className="h-[460px] w-full rounded-xl border border-border bg-slate-950 text-white">
      <defs>
        <marker id="field-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0l10 5-10 5z" fill="currentColor" />
        </marker>
      </defs>
      <rect width="900" height="460" fill="#020617" />
      <text x="34" y="42" fill="#e2e8f0" fontSize="22" fontWeight="700">{t("conceptElectricFieldTitle")}</text>
      <circle cx="430" cy="225" r="42" fill="#ef4444" opacity="0.9" />
      <text x="418" y="236" fill="white" fontSize="30" fontWeight="800">+</text>
      {Array.from({ length: 16 }, (_, index) => {
        const angle = (index / 16) * Math.PI * 2;
        const x1 = 430 + Math.cos(angle) * 66;
        const y1 = 225 + Math.sin(angle) * 66;
        const x2 = 430 + Math.cos(angle) * 178;
        const y2 = 225 + Math.sin(angle) * 178;
        return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="4" markerEnd="url(#field-arrow)" opacity="0.78" />;
      })}
      <foreignObject x="48" y="344" width="800" height="72">
        <div className="rounded-lg border border-white/10 bg-white/95 p-3 text-sm text-slate-950 shadow-xl">
          {t("conceptElectricFieldSummary")}
        </div>
      </foreignObject>
    </svg>
  );
}

function CircuitOhmDiagram() {
  const { t } = useI18n();
  return (
    <svg viewBox="0 0 900 460" className="h-[460px] w-full rounded-xl border border-border bg-slate-950 text-white">
      <defs>
        <marker id="circuit-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0l10 5-10 5z" fill="currentColor" />
        </marker>
      </defs>
      <rect width="900" height="460" fill="#020617" />
      <text x="34" y="42" fill="#e2e8f0" fontSize="22" fontWeight="700">{t("conceptOhmCircuitTitle")}</text>
      <path d="M170 220 H360 V120 H670 V330 H360 V220" fill="none" stroke="#94a3b8" strokeWidth="7" />
      <rect x="132" y="178" width="38" height="86" rx="6" fill="#38bdf8" />
      <rect x="170" y="194" width="22" height="54" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="4" />
      <text x="104" y="286" fill="#38bdf8" fontSize="14" fontWeight="700">{t("conceptVoltageU")}</text>
      <rect x="450" y="98" width="130" height="44" rx="10" fill="#818cf8" opacity="0.9" />
      <text x="474" y="126" fill="white" fontSize="16" fontWeight="700">{t("conceptResistorR")}</text>
      <circle cx="670" cy="330" r="42" fill="#facc15" opacity="0.34" stroke="#facc15" strokeWidth="5" />
      <text x="636" y="392" fill="#22c55e" fontSize="14" fontWeight="700">{t("conceptOutputPower")}</text>
      <path d="M240 220 H330" stroke="#22c55e" strokeWidth="5" markerEnd="url(#circuit-arrow)" />
      <path d="M610 330 H430" stroke="#22c55e" strokeWidth="5" markerEnd="url(#circuit-arrow)" />
      <foreignObject x="56" y="360" width="780" height="58">
        <div className="rounded-lg border border-white/10 bg-white/95 p-3 text-sm text-slate-950 shadow-xl">
          {t("conceptOhmSummary")}
        </div>
      </foreignObject>
    </svg>
  );
}

function OpticsRayDiagram() {
  const { t } = useI18n();
  return (
    <svg viewBox="0 0 900 460" className="h-[460px] w-full rounded-xl border border-border bg-slate-950 text-white">
      <defs>
        <marker id="ray-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0l10 5-10 5z" fill="currentColor" />
        </marker>
      </defs>
      <rect width="900" height="460" fill="#020617" />
      <text x="34" y="42" fill="#e2e8f0" fontSize="22" fontWeight="700">{t("conceptOpticsTitle")}</text>
      <path d="M430 95 C490 150 490 310 430 365 C370 310 370 150 430 95Z" fill="#38bdf8" opacity="0.28" stroke="#38bdf8" strokeWidth="4" />
      <line x1="58" y1="230" x2="820" y2="230" stroke="#334155" strokeWidth="2" />
      {[155, 205, 255].map((y, index) => (
        <path key={index} d={`M70 ${y} H420 C500 ${y} 585 230 820 230`} fill="none" stroke={index === 1 ? "#facc15" : "#818cf8"} strokeWidth="4" markerEnd="url(#ray-arrow)" />
      ))}
      <circle cx="705" cy="230" r="7" fill="#22c55e" />
      <text x="674" y="262" fill="#22c55e" fontSize="14" fontWeight="700">{t("conceptFocus")}</text>
      <foreignObject x="60" y="350" width="780" height="62">
        <div className="rounded-lg border border-white/10 bg-white/95 p-3 text-sm text-slate-950 shadow-xl">
          {t("conceptOpticsSummary")}
        </div>
      </foreignObject>
    </svg>
  );
}

function ConceptDiagram({ simulation, mode }: { simulation: Simulation; mode: ConceptMode }) {
  if (simulation.slug === "wave-particle") return <WaveParticleDiagram mode={mode} />;
  if (simulation.slug === "electric-field") return <ElectricFieldDiagram />;
  if (simulation.slug === "circuit-ohm") return <CircuitOhmDiagram />;
  if (simulation.slug === "optics-ray") return <OpticsRayDiagram />;
  return <WaveParticleDiagram mode={mode} />;
}

export function ConceptualPhysicsSimulation({ simulation }: { simulation: Simulation }) {
  const [mode, setMode] = useState<ConceptMode>("learn");
  const { t } = useI18n();

  return (
    <SimulationLayout simulation={simulation} parameters={{}} setParameter={() => undefined}>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2">
              {(["learn", "practice", "challenge"] as ConceptMode[]).map((item) => (
                <Button key={item} type="button" size="sm" variant={mode === item ? "primary" : "secondary"} onClick={() => setMode(item)}>
                  {t(modeLabelKeys[item])}
                </Button>
              ))}
            </div>
            <CardTitle>{t(modeTitleKeys[mode])}</CardTitle>
            <p className="text-sm text-muted-foreground">{t(modeCopyKeys[mode])}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConceptDiagram simulation={simulation} mode={mode} />
            <Legend />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-3 p-4 text-sm md:grid-cols-3">
            <div className="rounded-lg border border-border p-3">
              <p className="font-semibold">{t("conceptStructure")}</p>
              <p className="mt-1 text-muted-foreground">{t("conceptStructureBody")}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="font-semibold">{t("conceptFlow")}</p>
              <p className="mt-1 text-muted-foreground">{t("conceptFlowBody")}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="font-semibold">{t("conceptSafety")}</p>
              <p className="mt-1 text-muted-foreground">{t("conceptSafetyBody")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </SimulationLayout>
  );
}
