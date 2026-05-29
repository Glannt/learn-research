"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export type LabItem = {
  id: string;
  label: string;
  color?: string;
};

export function DragDropLabCanvas({
  items,
  dropped,
  onDropItem,
  onClear,
  title = "Drop zone",
  children
}: {
  items: LabItem[];
  dropped: LabItem[];
  onDropItem: (item: LabItem) => void;
  onClear: () => void;
  title?: string;
  children?: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);
  const byId = new Map(items.map((item) => [item.id, item]));

  return (
    <div className="grid gap-4 lg:grid-cols-[210px_1fr]">
      <div className="space-y-2 rounded-lg border border-border bg-card p-3">
        <p className="text-sm font-semibold">Palette</p>
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
            className="cursor-grab rounded-md border border-border px-3 py-2 text-sm shadow-sm active:cursor-grabbing"
            style={{ background: item.color ?? "hsl(var(--muted))" }}
          >
            {item.label}
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={onClear}>Clear</Button>
      </div>
      <div
        className={`min-h-[360px] rounded-lg border border-dashed p-4 transition ${hover ? "border-primary bg-muted" : "border-border bg-slate-950"}`}
        onDragOver={(event) => {
          event.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(event) => {
          event.preventDefault();
          setHover(false);
          const item = byId.get(event.dataTransfer.getData("text/plain"));
          if (item) onDropItem(item);
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-slate-300">{dropped.length} item(s)</p>
        </div>
        {children}
      </div>
    </div>
  );
}
