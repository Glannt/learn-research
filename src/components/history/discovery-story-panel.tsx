"use client";

import type { ScienceHistoryTopic } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

export function DiscoveryStoryPanel({ topic }: { topic: ScienceHistoryTopic }) {
  const { t } = useI18n();
  const rows = [
    [t("questionLabel"), topic.discoveryQuestion],
    [t("hypothesisLabel"), topic.hypothesis],
    [t("experimentLabel"), topic.experimentSetup],
    [t("observationLabel"), topic.observation],
    [t("conclusionLabel"), topic.conclusion]
  ];
  return (
    <Card>
      <CardHeader><CardTitle>{t("discoveryStoryTitle")}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {rows.map(([label, text]) => (
          <div key={label} className="rounded-md border border-border p-3 text-sm">
            <p className="font-semibold">{label}</p>
            <p className="mt-1 text-muted-foreground">{text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
