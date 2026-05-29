import type { InteractiveSimulationExercise } from "@/types";

export function LabInstructionPanel({ exercise }: { exercise: InteractiveSimulationExercise }) {
  return (
    <div className="rounded-md border border-border bg-card p-3 text-sm">
      <p className="font-semibold">{exercise.title}</p>
      <p className="mt-1 text-muted-foreground">{exercise.prompt}</p>
      <ol className="mt-3 list-decimal space-y-1 pl-4 text-muted-foreground">
        {exercise.requiredActions.map((action, index) => <li key={`${action}-${index}`}>{action}</li>)}
      </ol>
    </div>
  );
}
