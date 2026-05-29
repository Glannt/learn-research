"use client";

import { UserRound } from "lucide-react";
import type { ScienceHistoryTopic } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ScientistCard({ topic }: { topic: ScienceHistoryTopic }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4" /> {t("scientistTitle")}</div>
        {topic.scientistNames.map((name) => (
          <div key={name} className="rounded-md bg-muted p-3 text-sm">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{topic.period}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
