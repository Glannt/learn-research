"use client";

import { create } from "zustand";
import type { Locale } from "@/lib/i18n/dictionary";

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: "vi",
  setLocale: (locale) => set({ locale }),
  toggleLocale: () => set((state) => ({ locale: state.locale === "vi" ? "en" : "vi" }))
}));
