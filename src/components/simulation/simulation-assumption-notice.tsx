"use client";

import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";

export function SimulationAssumptionNotice({
  realEquation,
  approximation,
  limitations
}: {
  realEquation: string;
  approximation: string;
  limitations: string;
}) {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <AlertTriangle className="h-4 w-4" />
        {t("simEducationalApproximation")}
      </div>
      <p><strong>{t("simRealEquation")}:</strong> {realEquation}</p>
      <p className="mt-1"><strong>{t("simModel")}:</strong> {approximation}</p>
      <p className="mt-1"><strong>{t("simLimitations")}:</strong> {limitations}</p>
    </div>
  );
}
