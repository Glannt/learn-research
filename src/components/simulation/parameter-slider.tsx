"use client";

import type { SimulationParameter } from "@/types";
import { parameterCopy } from "@/lib/i18n/dictionary";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ParameterSlider({ parameter, value, onChange }: { parameter: SimulationParameter; value: number; onChange: (value: number) => void }) {
  const { locale, t } = useI18n();
  const copy = parameterCopy[parameter.key]?.[locale];
  const label = copy?.label ?? parameter.label;
  const unit = copy?.unit ?? parameter.unit;

  return (
    <label className="block rounded-md border border-border p-3">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value} {unit}
        </span>
      </div>
      <input
        className="w-full accent-blue-600"
        type="range"
        min={parameter.min}
        max={parameter.max}
        step={parameter.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
        {copy?.description ? <p>{copy.description}</p> : null}
        <p>{t("range")}: {parameter.min} - {parameter.max} {unit}</p>
      </div>
    </label>
  );
}
