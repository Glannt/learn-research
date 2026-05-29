"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { Simulation } from "@/types";
import type { VisualToggles } from "@/features/visual-simulation/components/OrbitControlToolbar";
import type { VisualViewMode } from "@/features/visual-simulation/components/TwoDThreeDToggle";
import { VisualSimulationLayout } from "@/features/visual-simulation/components/VisualSimulationLayout";
import { transformerVisual } from "@/features/visual-simulation/data/transformer.visual";
import { Transformer2D } from "@/features/visual-simulation/simulations/transformer/Transformer2D";
import { TransformerFailureModePanel, type TransformerFailureMode } from "@/features/visual-simulation/simulations/transformer/TransformerFailureModePanel";
import { TransformerWaveformChart } from "@/features/visual-simulation/simulations/transformer/TransformerWaveformChart";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

function Loading3DModel() {
  const { t } = useI18n();
  return (
    <Card>
      <CardContent className="p-6 text-muted-foreground">{t("simLoadingTransformer")}</CardContent>
    </Card>
  );
}

const Transformer3D = dynamic(
  () => import("@/features/visual-simulation/simulations/transformer/Transformer3D").then((mod) => mod.Transformer3D),
  {
    ssr: false,
    loading: () => <Loading3DModel />
  }
);

export function TransformerLab({ simulation }: { simulation: Simulation }) {
  void simulation;
  const visual = transformerVisual;
  const [viewMode, setViewMode] = useState<VisualViewMode>("3d");
  const [phase, setPhase] = useState(0);
  const [activeStepId, setActiveStepId] = useState(visual.steps[0].id);
  const [failureMode, setFailureMode] = useState<TransformerFailureMode>("normal");
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
    const primaryPeak = failureMode === "no-ac-input" ? 0 : parameterValues.Vp;
    const primaryTurns = parameterValues.Np;
    const secondaryTurns = parameterValues.Ns;
    const frequency = failureMode === "no-ac-input" ? 0 : parameterValues.f;
    const coupling = failureMode === "weak-coupling" ? parameterValues.coupling * 0.18 : parameterValues.coupling;
    const resistance = parameterValues.R;
    const idealSecondaryPeak = primaryPeak * (secondaryTurns / Math.max(1, primaryTurns)) * coupling;
    const primaryVoltage = primaryPeak * Math.sin(phase);
    const secondaryVoltage = idealSecondaryPeak * Math.sin(phase);
    const secondaryCurrent = failureMode === "open-secondary" ? 0 : secondaryVoltage / resistance;
    const loadBrightness = Math.min(1, Math.abs(secondaryCurrent) / 1.5);
    return { primaryPeak, primaryTurns, secondaryTurns, frequency, coupling, resistance, idealSecondaryPeak, primaryVoltage, secondaryVoltage, secondaryCurrent, loadBrightness };
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
      <Transformer2D
        visual={visual}
        phase={phase}
        primaryTurns={values.primaryTurns}
        secondaryTurns={values.secondaryTurns}
        secondaryVoltage={values.secondaryVoltage}
        brightness={values.loadBrightness}
        showLabels={toggles.labels}
        showField={toggles.fieldLines}
        showCurrent={toggles.currentArrows}
        showFormula={toggles.formula}
        failureMode={failureMode}
      />
    ) : (
      <Transformer3D
        phase={phase}
        setPhase={setPhase}
        frequency={values.frequency}
        primaryTurns={values.primaryTurns}
        secondaryTurns={values.secondaryTurns}
        coupling={values.coupling}
        secondaryCurrent={values.secondaryCurrent}
        loadBrightness={values.loadBrightness}
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
      chart={<TransformerWaveformChart phase={phase} primaryVoltage={values.primaryVoltage} secondaryVoltage={values.secondaryVoltage} secondaryCurrent={values.secondaryCurrent} />}
      failurePanel={<TransformerFailureModePanel value={failureMode} onChange={setFailureMode} />}
    />
  );
}
