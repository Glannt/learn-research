"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Simulation } from "@/types";
import { generateIdealGasParticles, idealGasPressure } from "@/lib/physics/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { ChartPanel } from "@/components/simulation/chart-panel";
import { ResultPanel } from "@/components/simulation/result-panel";
import { SimulationLayout, useSimulationParams } from "@/components/simulation/simulation-layout";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";

export function IdealGasSimulation({ simulation }: { simulation: Simulation }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef(generateIdealGasParticles(80));
  const [params, setParams] = useSimulationParams(simulation.parameters);
  const pressure = idealGasPressure({ n: params.n, temperature: params.temperature, volume: params.volume });

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        const width = canvas.width * Math.min(1, params.volume / 0.08 + 0.2);
        const height = canvas.height;
        const speed = Math.sqrt(params.temperature / 300);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#e2e8f0";
        ctx.strokeRect(20, 20, width - 40, height - 40);
        particlesRef.current.slice(0, params.particleCount).forEach((particle) => {
          particle.x += particle.vx * speed;
          particle.y += particle.vy * speed;
          if (particle.x < 28 || particle.x > width - 28) particle.vx *= -1;
          if (particle.y < 28 || particle.y > height - 28) particle.vy *= -1;
          particle.x = Math.max(28, Math.min(width - 28, particle.x));
          particle.y = Math.max(28, Math.min(height - 28, particle.y));
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [params]);

  const chartData = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const temperature = 150 + i * 20;
        return { t: temperature, P: idealGasPressure({ n: params.n, temperature, volume: params.volume }) };
      }),
    [params.n, params.volume]
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
                "Tăng nhiệt độ T để xem động năng và tốc độ của các hạt tăng lên.",
                "Giảm thể tích bình V để quan sát mật độ va chạm và áp suất tăng lên.",
                "Thay đổi lượng chất n (số hạt) để theo dõi biến thiên áp suất P."
              ]}
            >
              <canvas ref={canvasRef} width={760} height={340} className="h-[340px] w-full rounded-lg border border-border bg-slate-950" />
            </ZoomableVisual>
          </CardContent>
        </Card>
        <ResultPanel results={{ "Áp suất P (Pa)": pressure, "Nhiệt độ T (K)": params.temperature, "Thể tích V (m3)": params.volume, "Số mol n": params.n }} />
        <ChartPanel data={chartData} lines={[{ key: "P", color: "#38bdf8", name: "P theo T" }]} />
      </div>
    </SimulationLayout>
  );
}
