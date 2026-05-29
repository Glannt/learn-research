"use client";

import { useMemo, useState } from "react";
import type { Formula, SubjectKey } from "@/types";
import { Input } from "@/components/ui/input";
import { FormulaCard } from "@/components/formula/formula-card";
import { Button } from "@/components/ui/button";

export function FormulaSearch({ formulas }: { formulas: Formula[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<SubjectKey | "all">("all");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return formulas.filter((formula) => {
      const subjectMatch = subject === "all" || formula.subject === subject;
      const text = `${formula.name} ${formula.latex} ${formula.description}`.toLowerCase();
      return subjectMatch && (!q || text.includes(q));
    });
  }, [formulas, query, subject]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm v=s/t, F=ma, pH, n=m/M..." />
        <div className="flex gap-2">
          <Button variant={subject === "all" ? "primary" : "secondary"} onClick={() => setSubject("all")}>Tất cả</Button>
          <Button variant={subject === "physics" ? "primary" : "secondary"} onClick={() => setSubject("physics")}>Vật lý</Button>
          <Button variant={subject === "chemistry" ? "primary" : "secondary"} onClick={() => setSubject("chemistry")}>Hóa học</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((formula) => (
          <FormulaCard key={formula.id} formula={formula} />
        ))}
      </div>
      {!filtered.length ? <p className="rounded-lg border border-border p-6 text-center text-muted-foreground">Không tìm thấy công thức phù hợp.</p> : null}
    </div>
  );
}
