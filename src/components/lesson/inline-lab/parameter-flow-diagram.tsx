"use client";

import type { LabParameterBinding } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ParameterSourceBadge({ binding }: { binding: LabParameterBinding }) {
  const { t } = useI18n();
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{binding.parameterSymbol}</span>
        <Badge>{t("commonInput")}</Badge>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{binding.explanation}</p>
    </div>
  );
}

export function FormulaProcessingNode({ formulaIds }: { formulaIds: string[] }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-center">
      <p className="text-xs uppercase text-muted-foreground">{t("inlineLabFormulaNode")}</p>
      <p className="mt-1 font-semibold">{formulaIds.join(" + ")}</p>
    </div>
  );
}

export function ParameterOutputBadge({ binding }: { binding: LabParameterBinding }) {
  const { t } = useI18n();
  return (
    <div className="rounded-lg border border-amber-300/50 bg-amber-100/60 p-3 text-amber-950 dark:bg-amber-300/10 dark:text-amber-100">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{binding.parameterSymbol}</span>
        <Badge>{t("commonOutput")}</Badge>
      </div>
      <p className="mt-2 text-xs opacity-80">{binding.explanation}</p>
    </div>
  );
}

export function ParameterFlowDiagram({ bindings, formulaIds }: { bindings: LabParameterBinding[]; formulaIds: string[] }) {
  const { t } = useI18n();
  const inputBindings = bindings.filter((binding) => binding.sourceObjectId !== "formula-node");
  const outputBindings = bindings.filter((binding) => binding.sourceObjectId === "formula-node");

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{t("inlineLabParameterFlow")}</p>
          <p className="text-xs text-muted-foreground">{t("inlineLabInputToFormula")}</p>
        </div>
        <Badge>{bindings.length} {t("inlineLabBindings")}</Badge>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_190px_1fr]">
        <div className="space-y-2">
          {inputBindings.map((binding) => <ParameterSourceBadge key={`${binding.formulaId}-${binding.parameterSymbol}-input`} binding={binding} />)}
        </div>
        <div className="flex items-center justify-center">
          <FormulaProcessingNode formulaIds={formulaIds} />
        </div>
        <div className="space-y-2">
          {outputBindings.map((binding) => <ParameterOutputBadge key={`${binding.formulaId}-${binding.parameterSymbol}-output`} binding={binding} />)}
        </div>
      </div>
    </div>
  );
}

export function PhysicsParameterFlow({ bindings, formulaIds }: { bindings: LabParameterBinding[]; formulaIds: string[] }) {
  return <ParameterFlowDiagram bindings={bindings} formulaIds={formulaIds} />;
}

export function ChemistryParameterFlow({ bindings, formulaIds }: { bindings: LabParameterBinding[]; formulaIds: string[] }) {
  return <ParameterFlowDiagram bindings={bindings} formulaIds={formulaIds} />;
}
