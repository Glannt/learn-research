"use client";

import { BlockMath, InlineMath } from "react-katex";

export function FormulaMath({ latex, inline = false }: { latex: string; inline?: boolean }) {
  return inline ? <InlineMath math={latex} /> : <BlockMath math={latex} />;
}
