import Link from "next/link";
import type { Formula, FormulaDetail } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormulaMath } from "@/components/formula/formula-math";

export function LessonFormulaBlock({ formulas, formulaDetails }: { formulas: Formula[]; formulaDetails: FormulaDetail[] }) {
  const detailById = new Map(formulaDetails.map((detail) => [detail.id, detail]));
  const fallbackDetails = formulaDetails.filter((detail) => !formulas.some((formula) => formula.id === detail.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Công thức chính</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {formulas.map((formula) => {
          const detail = detailById.get(formula.id);
          return (
            <Link key={formula.id} href={`/formulas/${formula.subject}/${formula.slug}`} className="rounded-md border border-border p-4 hover:bg-muted">
              <p className="font-medium">{formula.name}</p>
              <div className="mt-2 rounded bg-background p-3 text-center">
                <FormulaMath latex={formula.latex} />
              </div>
              {detail ? <p className="mt-2 text-xs text-muted-foreground">{detail.shortMeaning}</p> : null}
            </Link>
          );
        })}
        {fallbackDetails.map((detail) => (
          <Link key={detail.id} href={`/formulas/${detail.subject}/${detail.slug}`} className="rounded-md border border-border p-4 hover:bg-muted">
            <p className="font-medium">{detail.name}</p>
            <div className="mt-2 rounded bg-background p-3 text-center">
              <FormulaMath latex={detail.latex} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{detail.shortMeaning}</p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
