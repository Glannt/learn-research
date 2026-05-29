"use client";

import type { VisualFormulaBinding, VisualParameterBinding } from "@/features/visual-simulation/models/visual-simulation.types";
import { ParameterSlider } from "@/components/simulation/parameter-slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ParameterBindingPanel({
  parameters,
  values,
  formulas,
  showFormulas,
  onChange
}: {
  parameters: VisualParameterBinding[];
  values: Record<string, number>;
  formulas: VisualFormulaBinding[];
  showFormulas: boolean;
  onChange: (key: string, value: number) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("simParameterBindings")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {parameters.map((parameter) => (
            <div key={parameter.id} className="space-y-2 rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{parameter.symbol}</Badge>
                <p className="font-medium">{parameter.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{parameter.objectId} → {parameter.objectProperty}</p>
              <p className="text-sm text-muted-foreground">{parameter.effect}</p>
              <ParameterSlider
                parameter={{
                  key: parameter.id,
                  label: parameter.name,
                  unit: parameter.unit,
                  min: parameter.min,
                  max: parameter.max,
                  defaultValue: parameter.defaultValue,
                  step: parameter.step
                }}
                value={values[parameter.id]}
                onChange={(value) => onChange(parameter.id, value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
      {showFormulas ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("simFormulaOverlay")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formulas.map((formula) => (
              <div key={formula.id} className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                <p className="font-mono text-base">{formula.latex}</p>
                <p className="mt-1 text-muted-foreground">{formula.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
