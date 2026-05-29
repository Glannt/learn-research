"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import type { SimulationValidationResult } from "@/lib/simulation-validation";
import { useI18n } from "@/lib/i18n/use-i18n";

export function LabFeedbackPanel({ result }: { result?: SimulationValidationResult }) {
  const { t } = useI18n();
  if (!result) {
    return <div className="rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">{t("simRunValidationHint")}</div>;
  }
  return (
    <div className={`rounded-md border p-3 text-sm ${result.ok ? "border-emerald-300 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-amber-300 bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}>
      <div className="mb-2 flex items-center gap-2 font-semibold">
        {result.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        {t("simScore")} {result.score}%
      </div>
      <ul className="space-y-1">
        {result.messages.map((message) => <li key={message}>{message}</li>)}
      </ul>
    </div>
  );
}
