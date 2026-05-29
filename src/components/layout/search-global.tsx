"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { searchItems } from "@/data/catalog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export function SearchGlobal() {
  const [query, setQuery] = useState("");
  const { t } = useI18n();
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalized) return [];
    return searchItems
      .filter((item) => [item.title, item.subtitle, ...item.keywords].join(" ").toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [normalized]);

  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchPlaceholder")} className="pl-9 pr-9" />
      {query ? (
        <Button className="absolute right-1 top-0.5" variant="ghost" size="icon" onClick={() => setQuery("")} aria-label="Clear search">
          <X className="h-4 w-4" />
        </Button>
      ) : null}
      {results.length ? (
        <div className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          {results.map((item) => (
            <Link key={`${item.href}-${item.title}`} href={item.href} onClick={() => setQuery("")} className="block border-b border-border p-3 last:border-b-0 hover:bg-muted">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
