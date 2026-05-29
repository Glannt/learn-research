"use client";

import type { ReactNode } from "react";

export function Interactive3DViewport({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-slate-950">
      <div className="h-[560px]">{children}</div>
      {caption ? (
        <div className="border-t border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300">
          {caption}
        </div>
      ) : null}
    </div>
  );
}
