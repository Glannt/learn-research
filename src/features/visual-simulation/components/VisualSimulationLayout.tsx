"use client";

import type { ReactNode } from "react";
import type { VisualSimulation } from "@/features/visual-simulation/models/visual-simulation.types";
import type { VisualToggles } from "@/features/visual-simulation/components/OrbitControlToolbar";
import type { VisualViewMode } from "@/features/visual-simulation/components/TwoDThreeDToggle";
import { ComponentAnnotationLayer } from "@/features/visual-simulation/components/ComponentAnnotationLayer";
import { OrbitControlToolbar } from "@/features/visual-simulation/components/OrbitControlToolbar";
import { ParameterBindingPanel } from "@/features/visual-simulation/components/ParameterBindingPanel";
import { SimulationStepController } from "@/features/visual-simulation/components/SimulationStepController";
import { TwoDThreeDToggle } from "@/features/visual-simulation/components/TwoDThreeDToggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

export function VisualSimulationLayout({
  visual,
  viewMode,
  setViewMode,
  toggles,
  onToggle,
  onResetCamera,
  onResetAnimation,
  activeStepId,
  setActiveStepId,
  parameterValues,
  setParameter,
  viewport,
  chart,
  failurePanel
}: {
  visual: VisualSimulation;
  viewMode: VisualViewMode;
  setViewMode: (value: VisualViewMode) => void;
  toggles: VisualToggles;
  onToggle: (key: keyof VisualToggles) => void;
  onResetCamera: () => void;
  onResetAnimation: () => void;
  activeStepId: string;
  setActiveStepId: (id: string) => void;
  parameterValues: Record<string, number>;
  setParameter: (key: string, value: number) => void;
  viewport: ReactNode;
  chart: ReactNode;
  failurePanel: ReactNode;
}) {
  const activeStep = visual.steps.find((step) => step.id === activeStepId) ?? visual.steps[0];
  const { t } = useI18n();

  return (
    <div className="space-y-5">
      <header className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>{visual.subject}</Badge>
              <Badge>{visual.category}</Badge>
              <Badge>{visual.visualStyle}</Badge>
            </div>
            <h1 className="mt-3 text-2xl font-semibold md:text-3xl">{visual.title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {t("simVisualSummary")}
            </p>
          </div>
          <TwoDThreeDToggle value={viewMode} onChange={setViewMode} />
        </div>
      </header>

      <OrbitControlToolbar toggles={toggles} onToggle={onToggle} onResetCamera={onResetCamera} onResetAnimation={onResetAnimation} />

      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
        <aside className="space-y-4">
          <SimulationStepController steps={visual.steps} activeStepId={activeStepId} onStepChange={setActiveStepId} />
          <ComponentAnnotationLayer annotations={visual.annotations} activeObjectIds={activeStep.activeObjectIds} />
          {failurePanel}
        </aside>

        <main className="min-w-0 space-y-4">
          <Card>
            <CardContent className="p-3 md:p-4">{viewport}</CardContent>
          </Card>
          {chart}
        </main>

        <aside>
          <ParameterBindingPanel parameters={visual.parameters} values={parameterValues} formulas={visual.formulas} showFormulas={toggles.formula} onChange={setParameter} />
        </aside>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        {visual.educationalNotes.simplifiedAssumptions.map((note) => (
          <div key={note} className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">{note}</div>
        ))}
        {visual.educationalNotes.realWorldLimitations.map((note) => (
          <div key={note} className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">{note}</div>
        ))}
        {visual.educationalNotes.safetyNotice ? (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
            {visual.educationalNotes.safetyNotice}
          </div>
        ) : null}
      </section>
    </div>
  );
}
