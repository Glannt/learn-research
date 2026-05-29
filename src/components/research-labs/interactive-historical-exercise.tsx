"use client";

import { useState } from "react";
import type { HistoricalExperimentStage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

export function InteractiveHistoricalExercise({ stage }: { stage?: HistoricalExperimentStage }) {
  const interaction = stage?.studentInteraction;
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const { t } = useI18n();

  if (!interaction) return null;

  const expected = interaction.expectedAnswer?.toLowerCase() ?? "";
  const isCorrect = Boolean(answer) && answer.toLowerCase() === expected;
  const options = interaction.options?.length
    ? interaction.options
    : expected
      ? Array.from(new Set([interaction.expectedAnswer ?? "", t("interactiveChallengeObserveOnly"), t("interactiveChallengeWrongSetup")].filter(Boolean)))
      : [t("interactiveChallengeObserve"), t("interactiveChallengeCompare"), t("interactiveChallengeRun")];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("interactiveChallengeTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{interaction.prompt}</p>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button key={option} type="button" variant={answer === option ? "primary" : "secondary"} onClick={() => setAnswer(option)}>
              {option}
            </Button>
          ))}
        </div>
        <Button type="button" onClick={() => setChecked(true)}>{t("interactiveChallengeCheck")}</Button>
        {checked ? (
          <div className={isCorrect ? "rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100" : "rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-500/10 dark:text-amber-100"}>
            {isCorrect ? t("interactiveChallengeCorrect") : `${t("interactiveChallengeExpected")}: ${interaction.expectedAnswer}.`}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
