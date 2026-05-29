"use client";

import Link from "next/link";
import { Atom, BarChart3, Beaker, BookOpen, Bot, FlaskConical, Gauge, History, Home, Microscope, Moon, Search, Sigma, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchGlobal } from "@/components/layout/search-global";
import { useThemeStore } from "@/features/progress/theme-store";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { useI18n } from "@/lib/i18n/use-i18n";

const nav = [
  { href: "/", labelKey: "navHome", icon: Home },
  { href: "/subjects", labelKey: "navSubjects", icon: BookOpen },
  { href: "/formulas", labelKey: "navFormulas", icon: Sigma },
  { href: "/lab", labelKey: "navLab", icon: FlaskConical },
  { href: "/history", labelKey: "navHistory", icon: History },
  { href: "/research-labs", labelKey: "navResearchLabs", icon: Microscope },
  { href: "/triz-chat", labelKey: "navTrizChat", icon: Bot },
  { href: "/quiz", labelKey: "navQuiz", icon: Gauge },
  { href: "/dashboard", labelKey: "navDashboard", icon: BarChart3 }
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dark = useThemeStore((state) => state.dark);
  const toggleDark = useThemeStore((state) => state.toggleDark);
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-border bg-card lg:block">
        <Link href="/" className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Atom className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">SciLearn Lab</p>
            <p className="text-xs text-muted-foreground">Physics + Chemistry</p>
          </div>
        </Link>
        <nav className="space-y-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  active && "bg-muted text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          <div className="rounded-lg bg-muted p-3 text-sm">
            <div className="flex items-center gap-2 font-medium">
              <Beaker className="h-4 w-4" />
              {t("chemistrySafetyTitle")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{t("chemistrySafetyBody")}</p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex min-h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:px-6">
          <div className="flex gap-1 lg:hidden">
            {nav.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="rounded-md p-2 hover:bg-muted" aria-label={t(item.labelKey)}>
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
          <Search className="hidden h-4 w-4 text-muted-foreground md:block" />
          <SearchGlobal />
          <LanguageSwitch />
          <Button variant="secondary" size="icon" onClick={toggleDark} aria-label={t("themeToggle")}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
