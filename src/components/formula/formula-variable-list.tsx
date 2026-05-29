"use client";

import type { FormulaVariable } from "@/types";
import { useI18n } from "@/lib/i18n/use-i18n";

const englishNames: Record<string, string> = {
  "v": "velocity",
  "s": "distance/displacement",
  "t": "time",
  "a": "acceleration",
  "F": "force",
  "m": "mass",
  "g": "gravity",
  "h": "height",
  "P": "power/pressure",
  "A": "work",
  "T": "period/temperature",
  "l": "length",
  "n": "amount of substance",
  "V": "volume",
  "M": "molar mass",
  "D": "density",
  "q": "charge",
  "U": "voltage",
  "R": "resistance",
  "I": "current"
};

function displayName(variable: FormulaVariable, locale: "vi" | "en") {
  const english = englishNames[variable.symbol] ?? englishNames[variable.symbol.replaceAll("\\", "")];
  if (locale === "vi" && english) return `${variable.name} (${english})`;
  if (locale === "en" && english) return english;
  return variable.name;
}

export function FormulaVariableList({ variables }: { variables: FormulaVariable[] }) {
  const { locale, t } = useI18n();
  return (
    <div className="space-y-2">
      {variables.map((variable) => (
        <div key={`${variable.symbol}-${variable.name}`} className="rounded-md border border-border p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong>{variable.symbol}</strong>
            <span className="text-xs text-muted-foreground">{t("unit")}: {variable.unit || "dimensionless"}</span>
          </div>
          <p className="mt-1 font-medium">{displayName(variable, locale)}</p>
          <p className="mt-1 text-muted-foreground">{variable.description || "This parameter must be interpreted in the formula context and converted to a consistent unit before calculation."}</p>
        </div>
      ))}
    </div>
  );
}
