"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { Simulation } from "@/types";
import type { VisualToggles } from "@/features/visual-simulation/components/OrbitControlToolbar";
import type { VisualViewMode } from "@/features/visual-simulation/components/TwoDThreeDToggle";
import { VisualSimulationLayout } from "@/features/visual-simulation/components/VisualSimulationLayout";
import { faradayInductionVisual } from "@/features/visual-simulation/data/faraday-induction.visual";
import { FaradayFailureModePanel, type FaradayFailureMode } from "@/features/visual-simulation/simulations/faraday-induction/FaradayFailureModePanel";
import { FaradayInduction2D } from "@/features/visual-simulation/simulations/faraday-induction/FaradayInduction2D";
import { FaradayWaveformChart } from "@/features/visual-simulation/simulations/faraday-induction/FaradayWaveformChart";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

function Loading3DModel() {
  const { t } = useI18n();
  return (
    <Card>
      <CardContent className="p-6 text-muted-foreground">{t("simLoadingFaraday")}</CardContent>
    </Card>
  );
}

const FaradayInduction3D = dynamic(
  () => import("@/features/visual-simulation/simulations/faraday-induction/FaradayInduction3D").then((mod) => mod.FaradayInduction3D),
  {
    ssr: false,
    loading: () => <Loading3DModel />
  }
);

export function FaradayInductionLab({ simulation }: { simulation: Simulation }) {
  void simulation;
  const visual = faradayInductionVisual;
  const [viewMode, setViewMode] = useState<VisualViewMode>("3d");
  const [phase, setPhase] = useState(0);
  const [activeStepId, setActiveStepId] = useState(visual.steps[0].id);
  const [failureMode, setFailureMode] = useState<FaradayFailureMode>("normal");
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
    const magnetSpeed = failureMode === "magnet-stopped" ? 0 : parameterValues.v;
    const magneticField = failureMode === "weak-field" ? parameterValues.B * 0.18 : parameterValues.B;
    const coilTurns = parameterValues.N;
    const coilArea = parameterValues.A;
    const resistance = parameterValues.R;
    const magnetPosition = Math.sin(phase);
    const fluxRate = magnetSpeed * Math.cos(phase);
    const amplitude = coilTurns * magneticField * coilArea * Math.max(magnetSpeed, 0);
    const inducedVoltage = amplitude * Math.cos(phase);
    const current = failureMode === "open-circuit" ? 0 : inducedVoltage / resistance;
    const meterDeflection = Math.max(-1, Math.min(1, current / 0.65));
    return { magnetSpeed, magneticField, coilTurns, coilArea, resistance, magnetPosition, fluxRate, amplitude, inducedVoltage, current, meterDeflection };
  }, [failureMode, parameterValues, phase]);

  function setParameter(key: string, value: number) {
    setParameterValues((current) => ({ ...current, [key]: value }));
  }

  function onToggle(key: keyof VisualToggles) {
    setToggles((current) => ({ ...current, [key]: !current[key] }));
  }

  function resetAnimation() {
    setPhase(0);
    setToggles((current) => ({ ...current, playing: false }));
  }

  const viewport =
    viewMode === "2d" ? (
      <FaradayInduction2D
        visual={visual}
        phase={phase}
        magnetX={values.magnetPosition}
        current={values.current}
        meterDeflection={values.meterDeflection}
        showLabels={toggles.labels}
        showField={toggles.fieldLines}
        showCurrent={toggles.currentArrows}
        showFormula={toggles.formula}
        failureMode={failureMode}
      />
    ) : (
      <FaradayInduction3D
        phase={phase}
        setPhase={setPhase}
        magnetSpeed={values.magnetSpeed}
        magneticField={values.magneticField}
        coilTurns={values.coilTurns}
        coilArea={values.coilArea}
        current={values.current}
        meterDeflection={values.meterDeflection}
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
      chart={<FaradayWaveformChart phase={phase} inducedVoltage={values.inducedVoltage} current={values.current} />}
      failurePanel={<FaradayFailureModePanel value={failureMode} onChange={setFailureMode} />}
    />
  );
}
