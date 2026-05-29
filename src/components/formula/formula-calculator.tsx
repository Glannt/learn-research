"use client";

import { Calculator } from "lucide-react";
import { useMemo, useState } from "react";
import type { CalculatorConfig } from "@/types";
import { evaluateFormula } from "@/lib/math/formula-engine";
import { formatNumber } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function FormulaCalculator({ config }: { config: CalculatorConfig }) {
  const [values, setValues] = useState(() => Object.fromEntries(config.inputs.map((input) => [input.key, input.defaultValue])));
  const result = useMemo(() => {
    try {
      return evaluateFormula(config.operationId, values);
    } catch {
      return Number.NaN;
    }
  }, [config.operationId, values]);

  return (
    <div className="rounded-lg border border-border bg-muted p-4">
      <div className="mb-4 flex items-center gap-2 font-medium">
        <Calculator className="h-4 w-4" />
        Calculator
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {config.inputs.map((input) => (
          <label key={input.key} className="text-sm">
            <span className="mb-1 block text-muted-foreground">
              {input.label} {input.unit ? `(${input.unit})` : ""}
            </span>
            <Input
              type="number"
              value={values[input.key]}
              step="any"
              onChange={(event) => setValues((state) => ({ ...state, [input.key]: Number(event.target.value) }))}
            />
          </label>
        ))}
      </div>
      <div className="mt-4 rounded-md bg-card p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Kết quả</p>
        <p className="mt-1 text-2xl font-semibold">
          {config.outputLabel}: {formatNumber(result, 4)} {config.outputUnit}
        </p>
      </div>
    </div>
  );
}
