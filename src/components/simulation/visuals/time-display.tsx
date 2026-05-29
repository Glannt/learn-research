import { Clock } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function TimeDisplay({ seconds, slowMotion }: { seconds: number; slowMotion?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <span className="font-semibold">{formatNumber(seconds, 2)} s</span>
      {slowMotion ? <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-xs text-amber-700 dark:text-amber-300">slow</span> : null}
    </div>
  );
}
