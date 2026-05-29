import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CauseEffectExplanation } from "@/features/visual-simulation/simulations/ac-generator/CauseEffectExplanation";

export const faradayFailureModes = [
  {
    id: "normal",
    label: "Normal",
    cause: "The magnet moves relative to a closed coil circuit.",
    effect: "Changing flux induces voltage, current flows and the meter needle deflects."
  },
  {
    id: "magnet-stopped",
    label: "Magnet stopped",
    cause: "Magnet position is constant, so magnetic flux through the coil is nearly constant.",
    effect: "dPhi/dt is near 0, the meter returns to center and current is near zero."
  },
  {
    id: "open-circuit",
    label: "Open circuit",
    cause: "The coil circuit is broken before the galvanometer.",
    effect: "Voltage can be induced, but no current flows through the meter."
  },
  {
    id: "weak-field",
    label: "Weak field",
    cause: "A small B field creates only a small flux change.",
    effect: "Voltage and current amplitude are low, so the meter deflects weakly."
  }
] as const;

export type FaradayFailureMode = (typeof faradayFailureModes)[number]["id"];

export function FaradayFailureModePanel({
  value,
  onChange
}: {
  value: FaradayFailureMode;
  onChange: (value: FaradayFailureMode) => void;
}) {
  const active = faradayFailureModes.find((mode) => mode.id === value) ?? faradayFailureModes[0];
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
          {faradayFailureModes.map((mode) => (
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
