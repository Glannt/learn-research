"use client";

import Link from "next/link";
import type { ScienceHistoryTopic } from "@/types";
import { formulas } from "@/data/catalog";
import { FormulaMath } from "@/components/formula/formula-math";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

export function FormulaOriginPanel({ topic }: { topic: ScienceHistoryTopic }) {
  const { t } = useI18n();
  const related = formulas.filter((formula) => topic.relatedFormulaIds.includes(formula.id));
  return (
    <Card>
      <CardHeader><CardTitle>{t("formulaOriginTitle")}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {topic.formulaDerived ? (
          <div className="rounded-md bg-muted p-3 text-center">
            <FormulaMath latex={topic.formulaDerived.replaceAll("delta", "\\Delta")} />
          </div>
        ) : null}
        {related.map((formula) => (
          <Link key={formula.id} href={`/formulas/${formula.subject}/${formula.slug}`} className="block rounded-md border border-border p-3 text-sm hover:bg-muted">
            {formula.name}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
