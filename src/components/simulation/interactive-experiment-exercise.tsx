import type { InteractiveSimulationExercise } from "@/types";
import { LabInstructionPanel } from "@/components/simulation/lab-instruction-panel";
import { SimulationAnswerValidator } from "@/components/simulation/simulation-answer-validator";
import type { SimulationValidationInput } from "@/lib/simulation-validation";

export function InteractiveExperimentExercise({
  exercise,
  input
}: {
  exercise: InteractiveSimulationExercise;
  input: SimulationValidationInput;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <LabInstructionPanel exercise={exercise} />
      <SimulationAnswerValidator exercise={exercise} input={input} />
    </div>
  );
}
