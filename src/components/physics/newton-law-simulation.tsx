"use client";

import type { Simulation } from "@/types";
import { newtonLawState } from "@/lib/physics/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { ResultPanel } from "@/components/simulation/result-panel";
import { SimulationLayout, useSimulationParams } from "@/components/simulation/simulation-layout";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";

export function NewtonLawSimulation({ simulation }: { simulation: Simulation }) {
  const [params, setParams] = useSimulationParams(simulation.parameters);
  const result = newtonLawState({ mass: params.mass, force: params.force, friction: params.friction, angleDeg: params.angle });
  const blockX = 80 + Math.min(360, result.acceleration * 55);

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
                "Quan sát gia tốc thay đổi khi thay đổi khối lượng hoặc lực kéo.",
                "Thay đổi góc kéo để xem biến thiên của phản lực và ma sát.",
                "Tăng hệ số ma sát để cản trở chuyển động."
              ]}
            >
            <svg viewBox="0 0 760 340" className="h-[340px] w-full rounded-lg border border-border bg-slate-950">
              <line x1="40" y1="240" x2="720" y2="240" stroke="#94a3b8" strokeWidth="3" />
              <rect x={blockX} y="170" width="120" height="70" rx="6" fill="#60a5fa" />
              <text x={blockX + 38} y="212" fill="#0f172a" fontSize="18" fontWeight="700">{params.mass} kg</text>
              <line x1={blockX + 120} y1="190" x2={blockX + 120 + result.horizontalForce * 0.8} y2={190 - result.verticalForce * 0.45} stroke="#22c55e" strokeWidth="4" />
              <line x1={blockX + 60} y1="170" x2={blockX + 60} y2={170 - result.normalForce * 0.06} stroke="#eab308" strokeWidth="4" />
              <line x1={blockX} y1="230" x2={blockX - result.frictionForce * 0.8} y2="230" stroke="#ef4444" strokeWidth="4" />
              <text x="52" y="44" fill="#e2e8f0" fontSize="16">F = ma với lực kéo, phản lực và ma sát</text>
              <text x="52" y="74" fill="#22c55e" fontSize="14">Xanh: lực kéo</text>
              <text x="52" y="96" fill="#ef4444" fontSize="14">Đỏ: lực ma sát</text>
              <text x="52" y="118" fill="#eab308" fontSize="14">Vàng: phản lực</text>
            </svg>
            </ZoomableVisual>
          </CardContent>
        </Card>
        <ResultPanel results={{ "Lực ngang (N)": result.horizontalForce, "Phản lực N (N)": result.normalForce, "Ma sát (N)": result.frictionForce, "Lực tổng hợp (N)": result.netForce, "Gia tốc (m/s2)": result.acceleration }} />
      </div>
    </SimulationLayout>
  );
}
