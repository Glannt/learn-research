"use client";

import type { VisualSimulationStep } from "@/features/visual-simulation/models/visual-simulation.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

export function SimulationStepController({
  steps,
  activeStepId,
  onStepChange
}: {
  steps: VisualSimulationStep[];
  activeStepId: string;
  onStepChange: (id: string) => void;
}) {
  const activeIndex = Math.max(0, steps.findIndex((step) => step.id === activeStepId));
  const active = steps[activeIndex] ?? steps[0];
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("simStepByStep")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              className={`w-full rounded-lg border p-3 text-left text-sm transition ${
                step.id === activeStepId ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-muted"
              }`}
              onClick={() => onStepChange(step.id)}
            >
              <p className="text-xs text-muted-foreground">{t("simStep")} {step.order}</p>
              <p className="font-medium">{step.title}</p>
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <p className="font-medium">{active.title}</p>
          <p className="mt-1 text-muted-foreground">{active.explanation}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => onStepChange(steps[Math.max(0, activeIndex - 1)].id)} disabled={activeIndex === 0}>
            {t("simPrev")}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => onStepChange(steps[Math.min(steps.length - 1, activeIndex + 1)].id)} disabled={activeIndex === steps.length - 1}>
            {t("simNext")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
