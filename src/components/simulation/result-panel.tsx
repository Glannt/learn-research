import { formatNumber } from "@/lib/utils";

export function ResultPanel({ results }: { results: Record<string, number | string> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Object.entries(results).map(([label, value]) => (
        <div key={label} className="rounded-md border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-lg font-semibold">{typeof value === "number" ? formatNumber(value, 4) : value}</p>
        </div>
      ))}
    </div>
  );
}
