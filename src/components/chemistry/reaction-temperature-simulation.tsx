"use client";

import { useMemo } from "react";
import type { Simulation } from "@/types";
import { reactionRateByTemperature } from "@/lib/chemistry/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { ChartPanel } from "@/components/simulation/chart-panel";
import { ResultPanel } from "@/components/simulation/result-panel";
import { SimulationLayout, useSimulationParams } from "@/components/simulation/simulation-layout";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";

export function ReactionTemperatureSimulation({ simulation }: { simulation: Simulation }) {
  const [params, setParams] = useSimulationParams(simulation.parameters);
  const rate = reactionRateByTemperature(1 / params.activationEnergy, params.temperature);
  const particles = Math.round(16 + rate * 10);
  const chartData = useMemo(
    () => Array.from({ length: 50 }, (_, i) => {
      const temperature = i * 3;
      return { t: temperature, rate: reactionRateByTemperature(1 / params.activationEnergy, temperature) };
    }),
    [params.activationEnergy]
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
                "Tăng nhiệt độ để cung cấp thêm động năng cho các phân tử phản ứng.",
                "Giảm năng lượng hoạt hóa (sử dụng chất xúc tác) để hạ thấp hàng rào năng lượng, làm tăng vọt tốc độ phản ứng.",
                "Quan sát số lượng phân tử chuyển động nhanh và quỹ đạo phản ứng thay đổi trên màn hình."
              ]}
            >
            <svg viewBox="0 0 760 320" className="h-[320px] w-full rounded-lg border border-border bg-slate-950">
              {Array.from({ length: particles }, (_, index) => {
                const x = 40 + ((index * 67) % 680);
                const y = 50 + ((index * 43) % 210);
                const hot = params.temperature > 60;
                return (
                  <g key={index}>
                    <circle cx={x} cy={y} r="8" fill={index % 2 ? "#38bdf8" : "#f97316"} opacity={0.85} />
                    <line x1={x} y1={y} x2={x + (hot ? 24 : 10)} y2={y + (index % 2 ? -8 : 8)} stroke="#e2e8f0" opacity="0.45" />
                  </g>
                );
              })}
              <path d="M80 270 C180 260 230 210 300 220 S430 120 520 145 S640 90 700 74" fill="none" stroke="#facc15" strokeWidth="4" />
              <text x="52" y="36" fill="#e2e8f0" fontSize="16">Tăng nhiệt độ → phân tử chuyển động nhanh hơn → va chạm hiệu quả tăng</text>
            </svg>
            </ZoomableVisual>
          </CardContent>
        </Card>
        <ResultPanel results={{ "Tốc độ tương đối": rate, "Nhiệt độ (C)": params.temperature, "Năng lượng hoạt hóa tương đối": params.activationEnergy }} />
        <ChartPanel data={chartData} lines={[{ key: "rate", color: "#f97316", name: "Tốc độ phản ứng" }]} />
      </div>
    </SimulationLayout>
  );
}
