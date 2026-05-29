"use client";

import { useMemo } from "react";
import type { Simulation } from "@/types";
import { molarity } from "@/lib/chemistry/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { ResultPanel } from "@/components/simulation/result-panel";
import { SimulationLayout, useSimulationParams } from "@/components/simulation/simulation-layout";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";

export function SolutionConcentrationSimulation({ simulation }: { simulation: Simulation }) {
  const [params, setParams] = useSimulationParams(simulation.parameters);
  const concentration = molarity(params.moles, params.volume);
  const visibleParticles = Math.round(params.particles * Math.min(1.5, concentration) / 1.5);
  const particles = useMemo(
    () =>
      Array.from({ length: 100 }, (_, index) => ({
        x: 42 + ((index * 71) % 680),
        y: 70 + ((index * 47) % 190)
      })),
    []
  );

  return (
    <SimulationLayout simulation={simulation} parameters={params} setParameter={(key, value) => setParams((state) => ({ ...state, [key]: value }))}>
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <ZoomableVisual
              title={simulation.title}
              parameters={params}
              setParameters={(key, value) => setParams((state) => ({ ...state, [key]: value }))}
              parameterDefs={simulation.parameters}
              subject={simulation.subject}
              safetyNote={simulation.safetyNote}
              instructions={[
                "Tăng số mol chất tan n để quan sát nồng độ dung dịch tăng lên (màu sắc đậm hơn, nhiều hạt hơn).",
                "Thêm nước (tăng thể tích V) để làm loãng dung dịch và giảm nồng độ.",
                "Theo dõi liên hệ giữa nồng độ CM = n / V trực quan."
              ]}
            >
            <svg viewBox="0 0 760 340" className="h-[340px] w-full rounded-lg border border-border bg-slate-950">
              <rect x="70" y="50" width="620" height="230" rx="12" fill="#075985" opacity="0.45" stroke="#38bdf8" strokeWidth="3" />
              <path d="M78 94 C180 80 240 110 340 96 S540 76 682 96" fill="none" stroke="#7dd3fc" strokeWidth="3" opacity="0.65" />
              {particles.slice(0, visibleParticles).map((particle, index) => (
                <circle key={index} cx={particle.x} cy={particle.y} r="5" fill={index % 3 === 0 ? "#facc15" : "#bef264"} opacity="0.9" />
              ))}
              <text x="80" y="310" fill="#e2e8f0" fontSize="16">CM = n / V = {concentration.toFixed(3)} M</text>
            </svg>
            </ZoomableVisual>
          </CardContent>
        </Card>
        <ResultPanel results={{ "Nồng độ mol CM (M)": concentration, "Số mol n": params.moles, "Thể tích V (L)": params.volume, "Hạt chất tan hiển thị": visibleParticles }} />
      </div>
    </SimulationLayout>
  );
}
