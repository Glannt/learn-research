"use client";

import { dictionaries, type DictionaryKey } from "@/lib/i18n/dictionary";
import { useLocaleStore } from "@/features/progress/locale-store";

export function useI18n() {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const toggleLocale = useLocaleStore((state) => state.toggleLocale);
  const t = (key: DictionaryKey) => dictionaries[locale][key] ?? key;
  return { locale, setLocale, toggleLocale, t };
}
