"use client";

import { useState } from "react";
import type { InteractiveSimulationExercise } from "@/types";
import { Button } from "@/components/ui/button";
import { LabFeedbackPanel } from "@/components/simulation/lab-feedback-panel";
import { validateSimulationExercise, type SimulationValidationInput, type SimulationValidationResult } from "@/lib/simulation-validation";
import { useI18n } from "@/lib/i18n/use-i18n";

export function SimulationAnswerValidator({
  exercise,
  input
}: {
  exercise: InteractiveSimulationExercise;
  input: SimulationValidationInput;
}) {
  const [result, setResult] = useState<SimulationValidationResult>();
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      <Button onClick={() => setResult(validateSimulationExercise(exercise.validation, input))}>{t("simValidateAnswer")}</Button>
      <LabFeedbackPanel result={result} />
      {result?.ok ? <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{exercise.explanation}</p> : null}
    </div>
  );
}
