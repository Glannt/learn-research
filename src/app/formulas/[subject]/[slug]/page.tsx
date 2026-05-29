import Link from "next/link";
import { notFound } from "next/navigation";
import { exercises, getFormula, getFormulaDetail } from "@/data/catalog";
import { FormulaCalculator } from "@/components/formula/formula-calculator";
import { FormulaMath } from "@/components/formula/formula-math";
import { FormulaVariableList } from "@/components/formula/formula-variable-list";
import {
  FormulaAssumptionNotice,
  FormulaCommonMistakes,
  FormulaExplanationPanel,
  FormulaMiniExample,
  FormulaParameterTable,
  FormulaRelatedLabs,
  FormulaUnitRuleBox,
  FormulaUsageCondition,
  FormulaVariableCard,
  FormulaVisualBindingMap
} from "@/components/formula/formula-detail-panels";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FormulaDetailPage({ params }: { params: Promise<{ subject: string; slug: string }> }) {
  const { subject, slug } = await params;
  const formula = getFormula(subject, slug);
  const detail = getFormulaDetail(subject, slug);
  if (!formula && !detail) notFound();
  const subjectKey = formula?.subject ?? detail?.subject ?? "physics";
  const practice = exercises.filter((exercise) => exercise.subject === subjectKey).slice(0, 3);

  if (detail) {
    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <article className="space-y-5">
          <div>
            <Badge>{detail.subject === "physics" ? "Vật lý" : "Hóa học"}</Badge>
            <h1 className="mt-3 text-3xl font-semibold">{detail.name}</h1>
            <p className="mt-2 text-muted-foreground">{detail.shortMeaning}</p>
          </div>
          <FormulaExplanationPanel detail={detail} />
          <FormulaParameterTable detail={detail} />
          <FormulaVariableCard detail={detail} />
          <FormulaVisualBindingMap detail={detail} />
          <FormulaMiniExample detail={detail} />
          {formula?.calculatorConfig ? <FormulaCalculator config={formula.calculatorConfig} /> : null}
        </article>
        <aside className="space-y-5">
          <FormulaUsageCondition detail={detail} />
          <FormulaUnitRuleBox detail={detail} />
          <FormulaAssumptionNotice detail={detail} />
          <FormulaCommonMistakes detail={detail} />
          <FormulaRelatedLabs detail={detail} />
          <Card>
            <CardHeader>
              <CardTitle>Bài tập luyện tập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {practice.map((exercise) => <p key={exercise.id} className="rounded-md border border-border p-3">{exercise.question}</p>)}
            </CardContent>
          </Card>
        </aside>
      </div>
    );
  }

  if (!formula) notFound();

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <article className="space-y-5">
        <div>
          <Badge>{formula.subject === "physics" ? "Vật lý" : "Hóa học"}</Badge>
          <h1 className="mt-3 text-3xl font-semibold">{formula.name}</h1>
          <p className="mt-2 text-muted-foreground">{formula.description}</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <FormulaMath latex={formula.latex} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Biến số và đơn vị</CardTitle>
          </CardHeader>
          <CardContent>
            <FormulaVariableList variables={formula.variables} />
          </CardContent>
        </Card>
        {formula.calculatorConfig ? <FormulaCalculator config={formula.calculatorConfig} /> : null}
      </article>
      <aside className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Khi nào sử dụng</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{formula.usage}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ví dụ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {formula.examples.map((item, index) => (
              <div key={index} className="rounded-md bg-muted p-3">
                <p className="font-medium">{item.problem}</p>
                <p className="mt-1 text-muted-foreground">{item.solution}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        {formula.relatedSimulationId ? (
          <Link href={`/lab/${formula.relatedSimulationId}`} className="block rounded-lg border border-border bg-card p-4 text-sm font-medium hover:bg-muted">
            Mở mô phỏng liên quan
          </Link>
        ) : null}
        <Card>
          <CardHeader>
            <CardTitle>Bài tập luyện tập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {practice.map((exercise) => <p key={exercise.id} className="rounded-md border border-border p-3">{exercise.question}</p>)}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
