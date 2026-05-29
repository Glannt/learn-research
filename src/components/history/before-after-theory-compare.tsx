"use client";

import type { ScienceHistoryTopic } from "@/types";
import { useI18n } from "@/lib/i18n/use-i18n";

export function BeforeAfterTheoryCompare({ topic }: { topic: ScienceHistoryTopic }) {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="font-semibold">{t("beforeTitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("beforeDesc")}</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="font-semibold">{t("afterTitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{topic.conclusion}</p>
      </div>
    </div>
  );
}
