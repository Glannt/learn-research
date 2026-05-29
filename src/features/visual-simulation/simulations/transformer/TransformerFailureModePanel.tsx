import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CauseEffectExplanation } from "@/features/visual-simulation/simulations/ac-generator/CauseEffectExplanation";

export const transformerFailureModes = [
  {
    id: "normal",
    label: "Normal",
    cause: "AC input drives the primary and the core couples changing flux to the secondary.",
    effect: "Secondary voltage follows the turn ratio and the load receives current."
  },
  {
    id: "no-ac-input",
    label: "No AC input",
    cause: "Primary voltage is zero or not changing.",
    effect: "No changing flux is produced, so the secondary output is near zero."
  },
  {
    id: "open-secondary",
    label: "Open secondary",
    cause: "The output circuit is disconnected from the load.",
    effect: "Secondary voltage can exist, but no load current flows and the lamp is off."
  },
  {
    id: "weak-coupling",
    label: "Weak coupling",
    cause: "Flux leakage or poor core coupling reduces flux reaching the secondary coil.",
    effect: "Secondary voltage and load brightness are much lower than the ideal ratio."
  }
] as const;

export type TransformerFailureMode = (typeof transformerFailureModes)[number]["id"];

export function TransformerFailureModePanel({
  value,
  onChange
}: {
  value: TransformerFailureMode;
  onChange: (value: TransformerFailureMode) => void;
}) {
  const active = transformerFailureModes.find((mode) => mode.id === value) ?? transformerFailureModes[0];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Failure state
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {transformerFailureModes.map((mode) => (
            <Button key={mode.id} type="button" size="sm" variant={value === mode.id ? "primary" : "secondary"} onClick={() => onChange(mode.id)}>
              {mode.label}
            </Button>
          ))}
        </div>
        <CauseEffectExplanation cause={active.cause} effect={active.effect} />
      </CardContent>
    </Card>
  );
}
