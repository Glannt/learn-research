import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CauseEffectExplanation } from "@/features/visual-simulation/simulations/ac-generator/CauseEffectExplanation";

export const acFailureModes = [
  {
    id: "normal",
    label: "Normal",
    cause: "The coil rotates in the magnetic field and both brushes touch the slip rings.",
    effect: "Induced voltage appears, AC current flows through the load, and the lamp brightness follows |I(t)|."
  },
  {
    id: "coil-stopped",
    label: "Coil not rotating",
    cause: "Angle theta is not changing, so magnetic flux is nearly constant.",
    effect: "dPhi/dt is near 0, the waveform collapses toward 0, and the lamp turns off."
  },
  {
    id: "brush-disconnected",
    label: "Brush disconnected",
    cause: "A brush no longer touches the slip ring, opening the external circuit.",
    effect: "Voltage can still be induced in the coil, but no current flows through the lamp."
  },
  {
    id: "weak-field",
    label: "Weak magnetic field",
    cause: "Small B means small magnetic flux and small flux change.",
    effect: "The waveform amplitude is low and the lamp glows weakly."
  }
] as const;

export type ACFailureMode = (typeof acFailureModes)[number]["id"];

export function FailureModePanel({ value, onChange }: { value: ACFailureMode; onChange: (value: ACFailureMode) => void }) {
  const active = acFailureModes.find((mode) => mode.id === value) ?? acFailureModes[0];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Failure state
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <FailureStateSimulator value={value} onChange={onChange} />
        <CauseEffectExplanation cause={active.cause} effect={active.effect} />
      </CardContent>
    </Card>
  );
}

export function FailureStateSimulator({ value, onChange }: { value: ACFailureMode; onChange: (value: ACFailureMode) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {acFailureModes.map((mode) => (
        <Button key={mode.id} type="button" size="sm" variant={value === mode.id ? "primary" : "secondary"} onClick={() => onChange(mode.id)}>
          {mode.label}
        </Button>
      ))}
    </div>
  );
}
