"use client";

import { useMemo, useState } from "react";
import type { Simulation, SimulationParameter } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParameterSlider } from "@/components/simulation/parameter-slider";
import { useI18n } from "@/lib/i18n/use-i18n";

export function useSimulationParams(parameters: SimulationParameter[]) {
  return useState<Record<string, number>>(() => Object.fromEntries(parameters.map((parameter) => [parameter.key, parameter.defaultValue])));
}

export function SimulationLayout({
  simulation,
  parameters,
  setParameter,
  children
}: {
  simulation: Simulation;
  parameters: Record<string, number>;
  setParameter: (key: string, value: number) => void;
  children: React.ReactNode;
}) {
  const activeParameters = useMemo(() => simulation.parameters.filter((parameter) => parameter.max > parameter.min), [simulation.parameters]);
  const { t } = useI18n();

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{simulation.subject === "physics" ? t("subjectPhysics") : t("subjectChemistry")}</Badge>
              <Badge>{simulation.dimension}</Badge>
              <Badge>{simulation.level}</Badge>
            </div>
            <CardTitle>{simulation.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{simulation.description}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeParameters.length ? (
              activeParameters.map((parameter) => (
                <ParameterSlider
                  key={parameter.key}
                  parameter={parameter}
                  value={parameters[parameter.key]}
                  onChange={(value) => setParameter(parameter.key, value)}
                />
              ))
            ) : (
              <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{t("chooseSampleControls")}</p>
            )}
          </CardContent>
        </Card>
        {simulation.safetyNote ? <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">{simulation.safetyNote}</div> : null}
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
