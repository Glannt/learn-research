"use client";

import { useMemo, useState } from "react";
import { FormulaMath } from "@/components/formula/formula-math";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatNumber } from "@/lib/utils";

export type FormulaOverlayMode = "view" | "practice" | "challenge";

export function DraggableFormulaToken({ token }: { token: string }) {
  return (
    <span draggable className="cursor-grab rounded-md border border-border bg-card px-2 py-1 text-xs font-semibold shadow-sm active:cursor-grabbing">
      {token}
    </span>
  );
}

export function UnitChecker({ expected, actual }: { expected: string; actual: string }) {
  const ok = expected.trim().toLowerCase() === actual.trim().toLowerCase();
  const { t } = useI18n();
  return <span className={ok ? "text-emerald-600" : "text-red-600"}>{ok ? t("simUnitOk") : `${t("simExpectedUnit")} ${expected}`}</span>;
}

export function InlineCalculationBox({
  label,
  value,
  unit,
  expectedUnit
}: {
  label: string;
  value: number;
  unit: string;
  expectedUnit: string;
}) {
  const [inputUnit, setInputUnit] = useState(unit);
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-lg font-semibold">{formatNumber(value, 3)}</span>
        <Input value={inputUnit} onChange={(event) => setInputUnit(event.target.value)} className="h-8 w-24" />
      </div>
      <p className="mt-1 text-xs"><UnitChecker expected={expectedUnit} actual={inputUnit} /></p>
    </div>
  );
}

export function FormulaOverlay({
  latex,
  tokens,
  values,
  mode = "view",
  feedback
}: {
  latex: string;
  tokens: string[];
  values: { label: string; value: number; unit: string; expectedUnit: string }[];
  mode?: FormulaOverlayMode;
  feedback?: string;
}) {
  const [dropped, setDropped] = useState<string[]>([]);
  const tokenSet = useMemo(() => new Set(dropped), [dropped]);
  const { t } = useI18n();

  return (
    <div className="rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
      <div className="rounded-md bg-muted p-3 text-center">
        <FormulaMath latex={latex} />
      </div>
      {mode !== "view" ? (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            {tokens.map((token) => (
              <button key={token} onClick={() => setDropped((state) => state.includes(token) ? state : [...state, token])}>
                <DraggableFormulaToken token={token} />
              </button>
            ))}
          </div>
          <div className="min-h-10 rounded-md border border-dashed border-border p-2 text-xs text-muted-foreground">
            {dropped.length ? dropped.join("  ") : t("simDropFormulaTokens")}
          </div>
          <Button size="sm" variant={tokens.every((token) => tokenSet.has(token)) ? "primary" : "secondary"}>
            {tokens.every((token) => tokenSet.has(token)) ? t("simFormulaComplete") : t("simCompleteFormula")}
          </Button>
        </div>
      ) : null}
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {values.map((item) => <InlineCalculationBox key={item.label} {...item} />)}
      </div>
      {feedback ? <p className="mt-3 rounded-md bg-muted p-2 text-xs text-muted-foreground">{feedback}</p> : null}
    </div>
  );
}
