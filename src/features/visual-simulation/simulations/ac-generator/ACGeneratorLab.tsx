"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { Simulation } from "@/types";
import type { VisualToggles } from "@/features/visual-simulation/components/OrbitControlToolbar";
import type { VisualViewMode } from "@/features/visual-simulation/components/TwoDThreeDToggle";
import { VisualSimulationLayout } from "@/features/visual-simulation/components/VisualSimulationLayout";
import { acGeneratorVisual } from "@/features/visual-simulation/data/ac-generator.visual";
import { ACGenerator2D } from "@/features/visual-simulation/simulations/ac-generator/ACGenerator2D";
import { ACWaveformChart } from "@/features/visual-simulation/simulations/ac-generator/ACWaveformChart";
import { type ACFailureMode, FailureModePanel } from "@/features/visual-simulation/simulations/ac-generator/FailureModePanel";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

function Loading3DModel() {
  const { t } = useI18n();
  return (
    <Card>
      <CardContent className="p-6 text-muted-foreground">{t("simLoadingAcGenerator")}</CardContent>
    </Card>
  );
}

const ACGenerator3D = dynamic(
  () => import("@/features/visual-simulation/simulations/ac-generator/ACGenerator3D").then((mod) => mod.ACGenerator3D),
  {
    ssr: false,
    loading: () => <Loading3DModel />
  }
);

export function ACGeneratorLab({ simulation }: { simulation: Simulation }) {
  void simulation;
  const visual = acGeneratorVisual;
  const [viewMode, setViewMode] = useState<VisualViewMode>("3d");
  const [angle, setAngle] = useState(0);
  const [activeStepId, setActiveStepId] = useState(visual.steps[0].id);
  const [failureMode, setFailureMode] = useState<ACFailureMode>("normal");
  const [resetCameraSignal, setResetCameraSignal] = useState(0);
  const [toggles, setToggles] = useState<VisualToggles>({
    labels: true,
    fieldLines: true,
    currentArrows: true,
    formula: true,
    exploded: false,
    cutaway: false,
    autoRotate: false,
    playing: true
  });
  const [parameterValues, setParameterValues] = useState<Record<string, number>>(
    Object.fromEntries(visual.parameters.map((parameter) => [parameter.id, parameter.defaultValue]))
  );

  const activeStep = visual.steps.find((step) => step.id === activeStepId) ?? visual.steps[0];

  const values = useMemo(() => {
    const omega = failureMode === "coil-stopped" ? 0 : parameterValues.omega;
    const magneticField = failureMode === "weak-field" ? parameterValues.B * 0.16 : parameterValues.B;
    const turns = parameterValues.N;
    const area = parameterValues.A;
    const resistance = parameterValues.R;
    const amplitude = turns * magneticField * area * Math.max(omega, 0);
    const voltage = amplitude * Math.sin(angle);
    const current = failureMode === "brush-disconnected" ? 0 : voltage / resistance;
    const lampBrightness = Math.min(1, Math.abs(current) / 0.62);
    return { omega, magneticField, turns, area, resistance, amplitude, voltage, current, lampBrightness };
  }, [angle, failureMode, parameterValues]);

  const samples = useMemo(() => {
    const relativeAmplitude = Math.min(1, values.amplitude / 3.2);
    return Array.from({ length: 120 }, (_, index) => {
      const x = (index / 119) * Math.PI * 2;
      const normalized = values.amplitude > 0 ? Math.sin(x) * relativeAmplitude * (failureMode === "brush-disconnected" ? 0 : 1) : 0;
      return { x, y: normalized };
    });
  }, [failureMode, values.amplitude]);

  function setParameter(key: string, value: number) {
    setParameterValues((current) => ({ ...current, [key]: value }));
  }

  function onToggle(key: keyof VisualToggles) {
    setToggles((current) => ({ ...current, [key]: !current[key] }));
  }

  function resetAnimation() {
    setAngle(0);
    setToggles((current) => ({ ...current, playing: false }));
  }

  const viewport =
    viewMode === "2d" ? (
      <ACGenerator2D
        visual={visual}
        angle={angle}
        current={values.current}
        lampBrightness={values.lampBrightness}
        showLabels={toggles.labels}
        showField={toggles.fieldLines}
        showCurrent={toggles.currentArrows}
        showFormula={toggles.formula}
        failureMode={failureMode}
      />
    ) : (
      <ACGenerator3D
        angle={angle}
        setAngle={setAngle}
        omega={values.omega}
        magneticField={values.magneticField}
        current={values.current}
        lampBrightness={values.lampBrightness}
        toggles={toggles}
        failureMode={failureMode}
        resetCameraSignal={resetCameraSignal}
        activeObjectIds={activeStep.activeObjectIds}
      />
    );

  return (
    <VisualSimulationLayout
      visual={visual}
      viewMode={viewMode}
      setViewMode={setViewMode}
      toggles={toggles}
      onToggle={onToggle}
      onResetCamera={() => setResetCameraSignal((value) => value + 1)}
      onResetAnimation={resetAnimation}
      activeStepId={activeStepId}
      setActiveStepId={setActiveStepId}
      parameterValues={parameterValues}
      setParameter={setParameter}
      viewport={viewport}
      chart={<ACWaveformChart samples={samples} currentAngle={angle} voltage={values.voltage} current={values.current} />}
      failurePanel={<FailureModePanel value={failureMode} onChange={setFailureMode} />}
    />
  );
}
