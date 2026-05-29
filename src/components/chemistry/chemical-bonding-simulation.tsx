"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Simulation } from "@/types";
import { interactiveExercises } from "@/data/interactive-exercises";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LabWorkspace } from "@/components/simulation/lab-workspace";
import { SimulationAssumptionNotice } from "@/components/simulation/simulation-assumption-notice";
import { FormulaOverlay } from "@/components/simulation/overlay/formula-overlay";
import { BondFormationAnimation } from "@/components/chemistry/sandbox/bond-formation-animation";
import { DragDropLabCanvas, type LabItem } from "@/components/chemistry/sandbox/drag-drop-lab-canvas";
import { InteractiveExperimentExercise } from "@/components/simulation/interactive-experiment-exercise";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";
import { useI18n } from "@/lib/i18n/use-i18n";

const atomItems: LabItem[] = [
  { id: "H", label: "H", color: "#e5e7eb" },
  { id: "O", label: "O", color: "#ef4444" },
  { id: "C", label: "C", color: "#64748b" },
  { id: "N", label: "N", color: "#3b82f6" },
  { id: "Na", label: "Na", color: "#a78bfa" },
  { id: "Cl", label: "Cl", color: "#22c55e" }
];

const moleculeRules: {
  formula: string;
  counts: Record<string, number>;
  kind: string;
  lewis: string;
  angle?: string;
}[] = [
  { formula: "NaCl", counts: { Na: 1, Cl: 1 }, kind: "Ionic bond: electron transfer from Na to Cl.", lewis: "Na+ [:Cl:]-" },
  { formula: "H2O", counts: { H: 2, O: 1 }, kind: "Polar covalent O-H bonds with shared electrons.", lewis: "H:O:H with two lone pairs on O", angle: "104.5 deg" },
  { formula: "CO2", counts: { C: 1, O: 2 }, kind: "Covalent double bonds.", lewis: "O=C=O", angle: "180 deg" },
  { formula: "NH3", counts: { N: 1, H: 3 }, kind: "Covalent N-H bonds.", lewis: "three N-H bonds and one lone pair", angle: "107 deg" },
  { formula: "CH4", counts: { C: 1, H: 4 }, kind: "Covalent C-H bonds.", lewis: "tetrahedral carbon with four C-H bonds", angle: "109.5 deg" },
  { formula: "HCl", counts: { H: 1, Cl: 1 }, kind: "Polar covalent H-Cl bond.", lewis: "H:Cl with lone pairs on Cl" },
  { formula: "O2", counts: { O: 2 }, kind: "Covalent double bond.", lewis: "O=O" },
  { formula: "N2", counts: { N: 2 }, kind: "Covalent triple bond.", lewis: "N≡N" }
];

function countsOf(items: LabItem[]) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = (acc[item.id] ?? 0) + 1;
    return acc;
  }, {});
}

function sameCounts(a: Record<string, number>, b: Record<string, number>) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].every((key) => (a[key] ?? 0) === (b[key] ?? 0));
}

export function ChemicalBondingSimulation({ simulation }: { simulation: Simulation }) {
  const { t } = useI18n();
  const [dropped, setDropped] = useState<LabItem[]>([]);
  const match = useMemo(() => moleculeRules.find((rule) => sameCounts(countsOf(dropped), rule.counts)), [dropped]);
  const nearMiss = dropped.length > 0 && !match;
  const h2oExercise = interactiveExercises.find((exercise) => exercise.id === "bonding-h2o");

  const center = (
    <Card>
      <CardContent className="p-4">
        <ZoomableVisual
          title={simulation.title}
          subject={simulation.subject}
          safetyNote={simulation.safetyNote}
          instructions={[
            "Kéo thả các nguyên tử (H, O, C, N, Na, Cl) từ danh sách vào vùng phản ứng.",
            "Các nguyên tử tương thích sẽ di chuyển lại gần để dùng chung electron hoặc nhường/nhận electron.",
            "Xem công thức hóa học, kiểu liên kết (Cộng hóa trị, Ion) và công thức Lewis của phân tử được tạo thành.",
            "Thử tạo ra các phân tử quen thuộc như H2O, CO2, NaCl, NH3, CH4."
          ]}
        >
          <DragDropLabCanvas
            items={atomItems}
            dropped={dropped}
            onDropItem={(item) => setDropped((current) => [...current, item])}
            onClear={() => setDropped([])}
            title="Drag atoms into the bonding area"
          >
            <BondFormationAnimation atoms={dropped} formula={match?.formula} bondKind={match?.kind} />
          </DragDropLabCanvas>
        </ZoomableVisual>
      </CardContent>
    </Card>
  );

  return (
    <LabWorkspace
      simulation={simulation}
      formula="Lewis dots + valence electrons"
      instructions={[
        "Drag atoms into the lab area.",
        "Compatible atoms move closer and form bonds.",
        "Use the feedback panel to compare formula, bond type and Lewis structure."
      ]}
      center={center}
      leftPanel={<SimulationAssumptionNotice realEquation="Valence electron and octet ideas" approximation="Atoms are represented as colored spheres with simplified valence dots." limitations="Quantum orbitals, resonance and formal charge are simplified for visual learning." />}
      rightPanel={
        <>
          <div className="rounded-md border border-border p-3 text-sm">
            <p className="font-semibold">Detected molecule</p>
            {match ? (
              <div className="mt-2 space-y-2">
                <p className="text-2xl font-semibold">{match.formula}</p>
                <p>{match.kind}</p>
                <p className="rounded bg-muted p-2">Lewis: {match.lewis}</p>
                {match.angle ? <p>Bond angle: {match.angle}</p> : null}
                <Link href="/lab/molecule-viewer" className="text-primary">Open 3D molecule viewer</Link>
              </div>
            ) : (
              <p className="mt-2 text-muted-foreground">{nearMiss ? "No stable sample molecule matches these atoms yet. Check atom counts and valence." : "Drop atoms to begin."}</p>
            )}
          </div>
          <FormulaOverlay
            latex="\\text{valence electrons}\\rightarrow\\text{bonding pattern}"
            mode="practice"
            tokens={["atom count", "valence", "bond type", "formula"]}
            values={[{ label: "Atoms in lab", value: dropped.length, unit: "atoms", expectedUnit: "atoms" }]}
            feedback={match ? `${match.formula} formed: ${match.kind}` : "Try H+O+H, C+O+O, N+H+H+H, or C+H+H+H+H."}
          />
          <Button variant="secondary" onClick={() => setDropped([])}>{t("simResetAtoms")}</Button>
        </>
      }
      bottomPanel={
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            {moleculeRules.map((rule) => (
              <button key={rule.formula} onClick={() => setDropped(Object.entries(rule.counts).flatMap(([symbol, count]) => Array.from({ length: count }, () => atomItems.find((atom) => atom.id === symbol) as LabItem)))} className="rounded-md border border-border bg-card p-3 text-left text-sm hover:bg-muted">
                <strong>{rule.formula}</strong>
                <p className="mt-1 text-xs text-muted-foreground">{rule.kind}</p>
              </button>
            ))}
          </div>
          {h2oExercise ? (
            <InteractiveExperimentExercise
              exercise={h2oExercise}
              input={{
                formulaTokens: dropped.map((item) => item.id),
                outcome: { moleculeFormula: match?.formula }
              }}
            />
          ) : null}
        </div>
      }
    />
  );
}
