"use client";

import type { VisualAnnotation } from "@/features/visual-simulation/models/visual-simulation.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

const roleClass = {
  input: "border-sky-300 bg-sky-50 text-sky-950 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100",
  process: "border-indigo-300 bg-indigo-50 text-indigo-950 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-100",
  output: "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
  warning: "border-orange-300 bg-orange-50 text-orange-950 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-100",
  measurement: "border-yellow-300 bg-yellow-50 text-yellow-950 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100"
};

export function ComponentAnnotationLayer({
  annotations,
  activeObjectIds
}: {
  annotations: VisualAnnotation[];
  activeObjectIds: string[];
}) {
  const active = annotations.filter((annotation) => activeObjectIds.includes(annotation.objectId));
  const visible = active.length > 0 ? active : annotations.slice(0, 3);
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("simComponentAnnotations")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {visible.map((annotation) => (
          <div
            key={annotation.id}
            className={`rounded-lg border p-3 text-sm ${roleClass[annotation.colorRole ?? "process"]}`}
          >
            <p className="font-semibold">{annotation.title}</p>
            <p className="mt-1 opacity-85">{annotation.body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
