"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function LanguageSwitch() {
  const { locale, toggleLocale, t } = useI18n();
  return (
    <Button variant="secondary" size="sm" onClick={toggleLocale} aria-label={t("language")}>
      <Languages className="h-4 w-4" />
      {locale.toUpperCase()}
    </Button>
  );
}
