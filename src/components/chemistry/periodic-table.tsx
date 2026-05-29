"use client";

import { useState } from "react";
import { chemicalElements } from "@/data/catalog";
import type { ChemicalElement } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function PeriodicTable({ onSelect }: { onSelect?: (element: ChemicalElement) => void }) {
  const [selected, setSelected] = useState<ChemicalElement>(chemicalElements[0]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="grid grid-cols-4 gap-2 md:grid-cols-10">
        {chemicalElements.map((element) => (
          <button
            key={element.symbol}
            className={`min-h-20 rounded-md border p-2 text-left transition hover:bg-muted ${selected.symbol === element.symbol ? "border-primary bg-muted" : "border-border bg-card"}`}
            style={{ gridColumn: undefined }}
            onClick={() => {
              setSelected(element);
              onSelect?.(element);
            }}
          >
            <p className="text-xs text-muted-foreground">{element.atomicNumber}</p>
            <p className="text-xl font-semibold">{element.symbol}</p>
            <p className="truncate text-xs">{element.name}</p>
          </button>
        ))}
      </div>
      <Card>
        <CardContent className="space-y-3 p-5">
          <Badge>{selected.category}</Badge>
          <h3 className="text-2xl font-semibold">{selected.name}</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt>Số hiệu</dt><dd>{selected.atomicNumber}</dd></div>
            <div className="flex justify-between"><dt>Khối lượng</dt><dd>{selected.atomicMass}</dd></div>
            <div className="flex justify-between"><dt>Nhóm / chu kỳ</dt><dd>{selected.group} / {selected.period}</dd></div>
            <div className="flex justify-between"><dt>Electron hóa trị</dt><dd>{selected.valenceElectrons}</dd></div>
          </dl>
          <p className="rounded-md bg-muted p-3 text-sm">{selected.electronConfiguration}</p>
        </CardContent>
      </Card>
    </div>
  );
}
