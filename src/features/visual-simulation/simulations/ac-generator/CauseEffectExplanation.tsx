export function CauseEffectExplanation({ cause, effect }: { cause: string; effect: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
      <p className="font-medium">Cause</p>
      <p className="mt-1 text-muted-foreground">{cause}</p>
      <p className="mt-3 font-medium">Effect</p>
      <p className="mt-1 text-muted-foreground">{effect}</p>
    </div>
  );
}
