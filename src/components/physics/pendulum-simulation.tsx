"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Simulation } from "@/types";
import { interactiveExercises } from "@/data/interactive-exercises";
import { pendulumPeriod, pendulumState } from "@/lib/physics/calculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartPanel } from "@/components/simulation/chart-panel";
import { ParameterSlider } from "@/components/simulation/parameter-slider";
import { ResultPanel } from "@/components/simulation/result-panel";
import { LabWorkspace } from "@/components/simulation/lab-workspace";
import { FormulaOverlay } from "@/components/simulation/overlay/formula-overlay";
import { SimulationAssumptionNotice } from "@/components/simulation/simulation-assumption-notice";
import { TimeDisplay } from "@/components/simulation/visuals/time-display";
import { useSimulationParams } from "@/components/simulation/simulation-layout";
import { InteractiveExperimentExercise } from "@/components/simulation/interactive-experiment-exercise";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/use-i18n";

type Point = { x: number; y: number };

function drawArrow(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string, label: string) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - 10 * Math.cos(angle - Math.PI / 6), to.y - 10 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(to.x - 10 * Math.cos(angle + Math.PI / 6), to.y - 10 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(label, to.x + 7, to.y - 7);
}

export function PendulumSimulation({ simulation }: { simulation: Simulation }) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastFrame = useRef<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [slowMotion, setSlowMotion] = useState(false);
  const [params, setParams] = useSimulationParams(simulation.parameters);
  const [time, setTime] = useState(0);
  const trailRef = useRef<Point[]>([]);

  const state = pendulumState({
    length: params.length,
    mass: params.mass,
    angle0Deg: params.angle,
    gravity: params.gravity,
    damping: params.damping,
    time
  });
  const labExercise = interactiveExercises.find((exercise) => exercise.simulationId === "pendulum");

  useEffect(() => {
    let frame = 0;
    const draw = (now: number) => {
      if (lastFrame.current === null) lastFrame.current = now;
      const dt = ((now - lastFrame.current) / 1000) * (slowMotion ? 0.25 : 1);
      lastFrame.current = now;
      const nextTime = playing ? time + dt : time;
      if (playing) setTime(nextTime);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        const width = canvas.width;
        const pivot = { x: width / 2, y: 58 };
        const scale = Math.min(230, 85 + params.length * 55);
        const current = pendulumState({ length: params.length, mass: params.mass, angle0Deg: params.angle, gravity: params.gravity, damping: params.damping, time: nextTime });
        const bob = { x: pivot.x + Math.sin(current.theta) * scale, y: pivot.y + Math.cos(current.theta) * scale };
        trailRef.current = [...trailRef.current.slice(-34), bob];

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(36, pivot.y);
        ctx.lineTo(width - 36, pivot.y);
        ctx.stroke();

        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        trailRef.current.forEach((point, index) => {
          ctx.globalAlpha = (index + 1) / trailRef.current.length;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2 + index * 0.08, 0, Math.PI * 2);
          ctx.stroke();
        });
        ctx.globalAlpha = 1;

        ctx.strokeStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(pivot.x, pivot.y, 52, Math.PI / 2, Math.PI / 2 - current.theta, current.theta > 0);
        ctx.stroke();
        ctx.fillStyle = "#facc15";
        ctx.font = "13px sans-serif";
        ctx.fillText(`${formatNumber((current.theta * 180) / Math.PI, 1)} deg`, pivot.x + 58, pivot.y + 20);

        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pivot.x, pivot.y);
        ctx.lineTo(bob.x, bob.y);
        ctx.stroke();

        const radius = 17 + params.mass * 1.6;
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(bob.x, bob.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#bae6fd";
        ctx.stroke();

        const tangent = { x: Math.cos(current.theta), y: -Math.sin(current.theta) };
        const radial = { x: -Math.sin(current.theta), y: -Math.cos(current.theta) };
        drawArrow(ctx, bob, { x: bob.x + tangent.x * Math.min(90, current.speed * 35), y: bob.y + tangent.y * Math.min(90, current.speed * 35) }, "#22c55e", "v");
        drawArrow(ctx, bob, { x: bob.x, y: bob.y + 68 }, "#ef4444", "mg");
        drawArrow(ctx, bob, { x: bob.x + radial.x * 70, y: bob.y + radial.y * 70 }, "#a78bfa", "T");
        drawArrow(ctx, bob, { x: bob.x - radial.x * Math.min(60, Math.abs(current.speed ** 2 / params.length) * 18), y: bob.y - radial.y * Math.min(60, Math.abs(current.speed ** 2 / params.length) * 18) }, "#f97316", "ac");

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "16px sans-serif";
        ctx.fillText("Trajectory, angle arc, velocity, gravity, tension, centripetal acceleration", 38, 34);
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [params, playing, slowMotion, time]);

  const chartData = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => {
        const t = i * 0.08;
        const value = pendulumState({ length: params.length, mass: params.mass, angle0Deg: params.angle, gravity: params.gravity, damping: params.damping, time: t });
        return { t: Number(t.toFixed(2)), kinetic: value.kineticEnergy, potential: value.potentialEnergy, total: value.kineticEnergy + value.potentialEnergy };
      }),
    [params]
  );

  const center = (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="relative">
          <ZoomableVisual
            title={simulation.title}
            parameters={params}
            setParameters={(key, value) => setParams((current) => ({ ...current, [key]: value }))}
            parameterDefs={simulation.parameters}
            subject={simulation.subject}
            safetyNote={simulation.safetyNote}
            instructions={[
              "Change string length and watch the period change.",
              "Increase damping to see the amplitude decay.",
              "Use slow motion to inspect force vectors during the swing."
            ]}
          >
            <canvas ref={canvasRef} width={820} height={420} className="h-[420px] w-full rounded-lg border border-border bg-slate-950" />
          </ZoomableVisual>
          <div className="absolute left-4 top-4">
            <TimeDisplay seconds={time} slowMotion={slowMotion} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? t("simPause") : t("simPlay")}</Button>
          <Button variant="secondary" onClick={() => { setTime(0); lastFrame.current = null; trailRef.current = []; }}><RotateCcw className="h-4 w-4" /> {t("simReset")}</Button>
          <Button variant={slowMotion ? "primary" : "secondary"} onClick={() => setSlowMotion((value) => !value)}>{t("simSlowMotion")}</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <LabWorkspace
      simulation={simulation}
      formula="T=2pi sqrt(l/g)"
      instructions={[
        "Change string length and watch the period change.",
        "Increase damping to see the amplitude decay.",
        "Use slow motion to inspect force vectors during the swing."
      ]}
      center={center}
      rightPanel={
        <>
          {simulation.parameters.map((parameter) => (
            <ParameterSlider key={parameter.key} parameter={parameter} value={params[parameter.key]} onChange={(value) => setParams((current) => ({ ...current, [parameter.key]: value }))} />
          ))}
          <FormulaOverlay
            latex="T=2\\pi\\sqrt{\\frac{l}{g}}"
            mode="practice"
            tokens={["T", "l", "g"]}
            values={[
              { label: "Period T", value: pendulumPeriod(params.length, params.gravity), unit: "s", expectedUnit: "s" },
              { label: t("simSpeed"), value: state.speed, unit: "m/s", expectedUnit: "m/s" }
            ]}
            feedback="Longer string means a lower angular frequency, so one oscillation takes more time."
          />
        </>
      }
      leftPanel={<SimulationAssumptionNotice realEquation="T=2pi sqrt(l/g)" approximation="Small-angle pendulum with exponential damping for air resistance." limitations="Large-angle nonlinear correction, rigid-body shape and turbulent drag are not modeled." />}
      bottomPanel={
        <div className="space-y-4">
          <ResultPanel results={{ "Period T (s)": pendulumPeriod(params.length, params.gravity), "Speed (m/s)": state.speed, "Tangential a (m/s2)": state.tangentialAcceleration, "Kinetic energy (J)": state.kineticEnergy, "Potential energy (J)": state.potentialEnergy }} />
          <ChartPanel data={chartData} lines={[{ key: "kinetic", color: "#38bdf8", name: "Kinetic" }, { key: "potential", color: "#f59e0b", name: "Potential" }, { key: "total", color: "#22c55e", name: "Total" }]} />
          {labExercise ? (
            <InteractiveExperimentExercise
              exercise={labExercise}
              input={{
                parameters: params,
                formulaTokens: ["T", "l", "g"],
                units: { period: "s" },
                outcome: { period: pendulumPeriod(params.length, params.gravity) }
              }}
            />
          ) : null}
        </div>
      }
    />
  );
}
