"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Simulation } from "@/types";
import { kinematicsState } from "@/lib/physics/calculations";
import { clamp, formatNumber } from "@/lib/utils";
import { interactiveExercises } from "@/data/interactive-exercises";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartPanel } from "@/components/simulation/chart-panel";
import { ParameterSlider } from "@/components/simulation/parameter-slider";
import { ResultPanel } from "@/components/simulation/result-panel";
import { LabWorkspace } from "@/components/simulation/lab-workspace";
import { FormulaOverlay } from "@/components/simulation/overlay/formula-overlay";
import { SimulationAssumptionNotice } from "@/components/simulation/simulation-assumption-notice";
import { SpeedometerGauge } from "@/components/simulation/gauges/lab-gauges";
import { DistanceRuler } from "@/components/simulation/visuals/distance-ruler";
import { MotionTrail } from "@/components/simulation/visuals/motion-trail";
import { RotatingWheel } from "@/components/simulation/visuals/rotating-wheel";
import { TimeDisplay } from "@/components/simulation/visuals/time-display";
import { VectorArrow } from "@/components/simulation/visuals/vector-arrow";
import { useSimulationParams } from "@/components/simulation/simulation-layout";
import { InteractiveExperimentExercise } from "@/components/simulation/interactive-experiment-exercise";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";
import { useI18n } from "@/lib/i18n/use-i18n";

function applyFriction(initialVelocity: number, acceleration: number, friction: number) {
  if (!friction) return acceleration;
  const direction = initialVelocity === 0 ? Math.sign(acceleration || 1) : Math.sign(initialVelocity);
  return acceleration - direction * friction * 9.81;
}

export function KinematicsSimulation({ simulation }: { simulation: Simulation }) {
  const { t } = useI18n();
  const enrichedParameters = useMemo(
    () =>
      simulation.parameters.some((item) => item.key === "friction")
        ? simulation.parameters
        : [...simulation.parameters, { key: "friction", label: "Friction", min: 0, max: 0.6, defaultValue: 0.05, step: 0.01 }],
    [simulation.parameters]
  );
  const [params, setParams] = useSimulationParams(enrichedParameters);
  const [playing, setPlaying] = useState(true);
  const [slowMotion, setSlowMotion] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const lastFrame = useRef<number | null>(null);

  const effectiveAcceleration = applyFriction(params.initialVelocity, params.acceleration, params.friction ?? 0);
  const result = kinematicsState({
    initialPosition: params.initialPosition,
    initialVelocity: params.initialVelocity,
    acceleration: effectiveAcceleration,
    time: simTime
  });
  const targetState = kinematicsState({
    initialPosition: params.initialPosition,
    initialVelocity: params.initialVelocity,
    acceleration: effectiveAcceleration,
    time: params.time
  });

  useEffect(() => {
    let frame = 0;
    const animate = (now: number) => {
      if (lastFrame.current === null) lastFrame.current = now;
      const dt = ((now - lastFrame.current) / 1000) * (slowMotion ? 0.25 : 1);
      lastFrame.current = now;
      if (playing) {
        setSimTime((time) => {
          const next = time + dt;
          return next > params.time ? params.time : next;
        });
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [params.time, playing, slowMotion]);

  const roadMeters = Math.max(120, Math.abs(targetState.position - params.initialPosition) + 40);
  const x = clamp(70 + ((result.position + roadMeters / 2) / roadMeters) * 620, 70, 690);
  const wheelRotation = result.position * 18;
  const trail = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const t = Math.max(0, simTime - (14 - index) * 0.16);
        const state = kinematicsState({ initialPosition: params.initialPosition, initialVelocity: params.initialVelocity, acceleration: effectiveAcceleration, time: t });
        return { x: clamp(70 + ((state.position + roadMeters / 2) / roadMeters) * 620, 70, 690), y: 178 };
      }),
    [effectiveAcceleration, params.initialPosition, params.initialVelocity, roadMeters, simTime]
  );
  const chartData = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => {
        const t = (i / 69) * Math.max(1, params.time);
        const value = kinematicsState({ initialPosition: params.initialPosition, initialVelocity: params.initialVelocity, acceleration: effectiveAcceleration, time: t });
        return { t: Number(t.toFixed(2)), s: value.position, v: value.velocity, a: value.acceleration };
      }),
    [effectiveAcceleration, params.initialPosition, params.initialVelocity, params.time]
  );
  const collided = Math.abs(result.position) > roadMeters / 2 - 8;
  const labExercises = interactiveExercises.filter((exercise) => exercise.simulationId === "kinematics");

  const center = (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="relative">
          <ZoomableVisual
            title={simulation.title}
            parameters={params}
            setParameters={(key, value) => setParams((state) => ({ ...state, [key]: value }))}
            parameterDefs={enrichedParameters}
            subject={simulation.subject}
            safetyNote={simulation.safetyNote}
            instructions={[
              t("kinematicsZoomGuide1"),
              t("kinematicsZoomGuide2"),
              t("kinematicsZoomGuide3"),
              t("kinematicsZoomGuide4")
            ]}
          >
            <svg viewBox="0 0 760 360" className="h-[360px] w-full rounded-lg border border-border bg-slate-950">
              <rect x="32" y="216" width="696" height="34" rx="8" fill="#334155" />
              <DistanceRuler x={60} y={290} width={640} meters={roadMeters} />
              <MotionTrail points={trail} />
              <g transform={`translate(${x - 58}, 0)`}>
                <rect x="10" y="128" width="96" height="44" rx="8" fill={collided ? "#f97316" : "#60a5fa"} />
                <path d="M28 128 L44 104 H76 L94 128 Z" fill="#93c5fd" />
                <RotatingWheel cx={32} cy={178} r={15} rotation={wheelRotation} />
                <RotatingWheel cx={86} cy={178} r={15} rotation={wheelRotation} />
              </g>
              <VectorArrow x={x + 45} y={116} dx={clamp(result.velocity * 5, -110, 110)} dy={0} color="#22c55e" label="v" />
              <VectorArrow x={x + 45} y={206} dx={clamp(effectiveAcceleration * 14, -100, 100)} dy={0} color="#f97316" label="a" />
              {collided ? <text x="380" y="72" fill="#fed7aa" textAnchor="middle" fontSize="18" fontWeight="700">{t("kinematicsBoundaryReached")}</text> : null}
              <text x="48" y="38" fill="#e2e8f0" fontSize="16">{t("kinematicsVisualCaption")}</text>
            </svg>
          </ZoomableVisual>
          <div className="absolute left-4 top-4">
            <TimeDisplay seconds={simTime} slowMotion={slowMotion} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? t("simPause") : t("simPlay")}</Button>
          <Button variant="secondary" onClick={() => { setSimTime(0); lastFrame.current = null; }}><RotateCcw className="h-4 w-4" /> {t("simReset")}</Button>
          <Button variant={slowMotion ? "primary" : "secondary"} onClick={() => setSlowMotion((value) => !value)}>{t("simSlowMotion")}</Button>
        </div>
      </CardContent>
    </Card>
  );

  const rightPanel = (
    <>
      {enrichedParameters.map((parameter) => (
        <ParameterSlider key={parameter.key} parameter={parameter} value={params[parameter.key]} onChange={(value) => setParams((state) => ({ ...state, [parameter.key]: value }))} />
      ))}
      <SpeedometerGauge value={Math.abs(result.velocity)} />
      <FormulaOverlay
        latex="s=s_0+v_0t+\\frac{1}{2}at^2"
        mode="practice"
        tokens={["s", "s0", "v0", "t", "a"]}
        values={[
          { label: t("kinematicsCurrentS"), value: result.position, unit: "m", expectedUnit: "m" },
          { label: t("kinematicsCurrentV"), value: result.velocity, unit: "m/s", expectedUnit: "m/s" }
        ]}
        feedback={`${t("kinematicsFeedbackPrefix")}${formatNumber(simTime, 2)}${t("kinematicsFeedbackMiddle")}${formatNumber(effectiveAcceleration, 2)} m/s2.`}
      />
    </>
  );

  return (
    <LabWorkspace
      simulation={simulation}
      formula="s=s0+v0t+1/2at^2"
      instructions={[
        t("kinematicsInstruction1"),
        t("kinematicsInstruction2"),
        t("kinematicsInstruction3")
      ]}
      center={center}
      rightPanel={rightPanel}
      leftPanel={<SimulationAssumptionNotice realEquation="s=s0+v0t+1/2at^2" approximation={t("kinematicsAssumption")} limitations={t("kinematicsLimitations")} />}
      bottomPanel={
        <div className="space-y-4">
          <ResultPanel results={{ [t("kinematicsPosition")]: result.position, [t("kinematicsVelocity")]: result.velocity, [t("kinematicsEffectiveA")]: effectiveAcceleration, [t("kinematicsTargetPosition")]: targetState.position }} />
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartPanel data={chartData} lines={[{ key: "s", color: "#38bdf8", name: "s-t" }]} />
            <ChartPanel data={chartData} lines={[{ key: "v", color: "#22c55e", name: "v-t" }, { key: "a", color: "#f97316", name: "a-t" }]} />
          </div>
          <div className="space-y-4">
            {labExercises.map((exercise) => (
              <InteractiveExperimentExercise
                key={exercise.id}
                exercise={exercise}
                input={{
                  parameters: params,
                  formulaTokens: exercise.id.includes("100m") ? ["s", "v", "t"] : ["a", "delta v", "delta t"],
                  units: { distance: "m", velocity: "m/s", time: "s", acceleration: "m/s2" },
                  outcome: { distance: result.position, finalVelocity: result.velocity }
                }}
              />
            ))}
          </div>
        </div>
      }
    />
  );
}
