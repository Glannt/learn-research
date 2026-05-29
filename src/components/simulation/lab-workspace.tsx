"use client";

import { useState } from "react";
import type { Simulation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

export type LabMode = "learn" | "practice" | "challenge";

const modeLabelKeys = {
  learn: "commonLearn",
  practice: "commonPractice",
  challenge: "commonChallenge"
} as const satisfies Record<LabMode, "commonLearn" | "commonPractice" | "commonChallenge">;

const modeHelpKeys = {
  learn: "simLearnHelp",
  practice: "simPracticeHelp",
  challenge: "simChallengeHelp"
} as const satisfies Record<LabMode, "simLearnHelp" | "simPracticeHelp" | "simChallengeHelp">;

export function LabWorkspace({
  simulation,
  formula,
  instructions,
  leftPanel,
  center,
  rightPanel,
  bottomPanel
}: {
  simulation: Simulation;
  formula?: string;
  instructions: string[];
  leftPanel?: React.ReactNode;
  center: React.ReactNode;
  rightPanel: React.ReactNode;
  bottomPanel?: React.ReactNode;
}) {
  const [mode, setMode] = useState<LabMode>("learn");
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>{t(simulation.subject === "physics" ? "commonPhysics" : "commonChemistry")}</Badge>
              <Badge>{simulation.dimension}</Badge>
              <Badge>{simulation.level}</Badge>
              {formula ? <Badge>{formula}</Badge> : null}
            </div>
            <h1 className="mt-3 text-2xl font-semibold">{simulation.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{simulation.description}</p>
          </div>
          <div className="flex rounded-md border border-border bg-muted p-1">
            {(Object.keys(modeLabelKeys) as LabMode[]).map((item) => (
              <Button key={item} size="sm" variant={mode === item ? "primary" : "ghost"} onClick={() => setMode(item)}>
                {t(modeLabelKeys[item])}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <Card>
          <CardContent className="space-y-4 p-4">
            <div>
              <p className="text-sm font-semibold">{t("commonGoal")}</p>
              <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
                {instructions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {t(modeHelpKeys[mode])}
            </div>
            {leftPanel}
          </CardContent>
        </Card>

        <div className="min-w-0">{center}</div>

        <Card>
          <CardContent className="space-y-4 p-4">{rightPanel}</CardContent>
        </Card>
      </div>

      {bottomPanel ? <div>{bottomPanel}</div> : null}
    </div>
  );
}
