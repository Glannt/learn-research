"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/features/progress/theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dark = useThemeStore((state) => state.dark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return children;
}
