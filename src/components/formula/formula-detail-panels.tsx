import Link from "next/link";
import type { FormulaDetail } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormulaMath } from "@/components/formula/formula-math";

export function FormulaExplanationPanel({ detail }: { detail: FormulaDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Giải thích công thức</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-7">
        <div className="rounded-lg border border-border bg-muted/40 p-5 text-center">
          <FormulaMath latex={detail.latex} />
          <p className="mt-3 text-muted-foreground">{detail.plainText}</p>
        </div>
        <p className="font-medium">{detail.shortMeaning}</p>
        <p className="text-muted-foreground">{detail.fullExplanation}</p>
      </CardContent>
    </Card>
  );
}

export function FormulaParameterTable({ detail }: { detail: FormulaDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bảng tham số</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-3 pr-4">Symbol</th>
              <th className="py-3 pr-4">Tên</th>
              <th className="py-3 pr-4">Vai trò</th>
              <th className="py-3 pr-4">Đơn vị</th>
              <th className="py-3 pr-4">Ý nghĩa</th>
              <th className="py-3 pr-4">Object trên mô hình</th>
            </tr>
          </thead>
          <tbody>
            {detail.variables.map((variable) => (
              <tr key={`${detail.id}-${variable.symbol}`} className="border-b border-border/60 align-top">
                <td className="py-3 pr-4 font-semibold">{variable.symbol}</td>
                <td className="py-3 pr-4">{variable.name}</td>
                <td className="py-3 pr-4">
                  <Badge>{variable.role}</Badge>
                </td>
                <td className="py-3 pr-4">
                  <span className="font-medium">{variable.unit || "không có"}</span>
                  <p className="text-xs text-muted-foreground">{variable.unitName}</p>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">
                  <p>{variable.description}</p>
                  {variable.physicalMeaning ? <p className="mt-1">Vật lý: {variable.physicalMeaning}</p> : null}
                  {variable.chemicalMeaning ? <p className="mt-1">Hóa học: {variable.chemicalMeaning}</p> : null}
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{variable.visualBinding?.label ?? "Chưa gắn"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function FormulaVariableCard({ detail }: { detail: FormulaDetail }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {detail.variables.map((variable) => (
        <Card key={`${detail.id}-card-${variable.symbol}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{variable.symbol}</p>
                <p className="text-sm font-medium">{variable.name}</p>
              </div>
              <Badge>{variable.role}</Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{variable.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">Đơn vị: {variable.unit || "không có"} ({variable.unitName})</p>
            {variable.visualBinding ? (
              <p className="mt-2 rounded-md bg-muted p-2 text-xs">
                Gắn với: {variable.visualBinding.label} - thuộc tính {variable.visualBinding.property}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export const FormulaParameterCard = FormulaVariableCard;

export function FormulaVisualBindingMap({ detail }: { detail: FormulaDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapping công thức với mô hình</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {detail.visualMappings.map((mapping) => (
          <div key={`${mapping.formulaId}-${mapping.parameterSymbol}-${mapping.visualObjectId}`} className="grid gap-3 rounded-lg border border-border p-3 text-sm md:grid-cols-[120px_1fr]">
            <div className="flex items-center gap-2 font-semibold">
              <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">{mapping.parameterSymbol}</span>
              <span>→</span>
            </div>
            <div>
              <p className="font-medium">{mapping.visualObjectName}</p>
              <p className="text-muted-foreground">{mapping.explanation}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function FormulaUsageCondition({ detail }: { detail: FormulaDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Điều kiện áp dụng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="font-medium">Dùng khi</p>
          <ul className="mt-2 space-y-2 text-muted-foreground">
            {detail.usedWhen.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </div>
        {detail.notUsedWhen?.length ? (
          <div>
            <p className="font-medium">Không nên dùng khi</p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              {detail.notUsedWhen.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function FormulaCommonMistakes({ detail }: { detail: FormulaDetail }) {
  const mistakes = detail.variables.flatMap((variable) => (variable.commonMistakes ?? []).map((mistake) => `${variable.symbol}: ${mistake}`));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sai lầm phổ biến</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {mistakes.map((mistake) => <p key={mistake} className="rounded-md border border-border p-3">{mistake}</p>)}
      </CardContent>
    </Card>
  );
}

export function FormulaMiniExample({ detail }: { detail: FormulaDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ví dụ ứng dụng nhỏ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {detail.exampleApplications.map((example) => (
          <div key={example.title} className="rounded-lg border border-border p-4">
            <p className="font-medium">{example.title}</p>
            <div className="mt-2 grid gap-2 text-muted-foreground">
              {example.steps.map((step) => <p key={step}>- {step}</p>)}
            </div>
            <p className="mt-3 rounded-md bg-muted p-3">{example.result}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function FormulaUnitRuleBox({ detail }: { detail: FormulaDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quy tắc đơn vị</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {detail.unitRules.map((rule) => (
          <div key={`${rule.parameterSymbol}-${rule.expectedUnit}`} className="flex items-start justify-between gap-3 rounded-md bg-muted p-3">
            <span className="font-semibold">{rule.parameterSymbol}</span>
            <span className="text-muted-foreground">{rule.expectedUnit}: {rule.note}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function FormulaAssumptionNotice({ detail }: { detail: FormulaDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Giả định và giới hạn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div>
          <p className="font-medium text-foreground">Giả định mô phỏng</p>
          {detail.assumptions?.map((item) => <p key={item} className="mt-2">- {item}</p>)}
        </div>
        <div>
          <p className="font-medium text-foreground">Giới hạn</p>
          {detail.limitations?.map((item) => <p key={item} className="mt-2">- {item}</p>)}
        </div>
      </CardContent>
    </Card>
  );
}

export function FormulaRelatedLabs({ detail }: { detail: FormulaDetail }) {
  if (!detail.relatedSimulationLabIds.length) return null;
  return (
    <div className="grid gap-2">
      {detail.relatedSimulationLabIds.map((labId) => (
        <Link key={labId} href={`/lab/${labId}`} className="rounded-lg border border-border bg-card p-4 text-sm font-medium hover:bg-muted">
          Mở lab nâng cao: {labId}
        </Link>
      ))}
    </div>
  );
}
