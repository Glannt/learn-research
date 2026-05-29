"use client";

import { FlaskConical, Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { ChemicalSpecies, ReactionSimulation, Simulation } from "@/types";
import { reactionSimulations } from "@/data/catalog";
import { interactiveExercises } from "@/data/interactive-exercises";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ParameterSlider } from "@/components/simulation/parameter-slider";
import { ResultPanel } from "@/components/simulation/result-panel";
import { LabWorkspace } from "@/components/simulation/lab-workspace";
import { SimulationAssumptionNotice } from "@/components/simulation/simulation-assumption-notice";
import { DragDropLabCanvas, type LabItem } from "@/components/chemistry/sandbox/drag-drop-lab-canvas";
import { MoleculeCollisionView } from "@/components/chemistry/sandbox/molecule-collision-view";
import { ReactionEnergyProfile } from "@/components/chemistry/sandbox/reaction-energy-profile";
import { InteractiveExperimentExercise } from "@/components/simulation/interactive-experiment-exercise";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";
import { useI18n } from "@/lib/i18n/use-i18n";

function speciesToItem(species: ChemicalSpecies): LabItem {
  return {
    id: species.id,
    label: species.formula,
    color: species.phase === "solid" ? "#e5e7eb" : species.phase === "gas" ? "#bfdbfe" : species.phase === "aqueous" ? "#a7f3d0" : "#fde68a"
  };
}

function reactionMatches(reaction: ReactionSimulation, dropped: LabItem[]) {
  const expected = reaction.reactants.map((item) => item.id).sort().join("|");
  const actual = dropped.map((item) => item.id).sort().join("|");
  return expected === actual;
}

export function ChemicalReactionSandbox({ simulation }: { simulation: Simulation }) {
  const { t } = useI18n();
  const [reaction, setReaction] = useState<ReactionSimulation>(reactionSimulations[2]);
  const [dropped, setDropped] = useState<LabItem[]>([]);
  const [running, setRunning] = useState(false);
  const [temperature, setTemperature] = useState(25);
  const [pressure, setPressure] = useState(1);
  const [concentration, setConcentration] = useState(1);
  const palette = useMemo(() => reaction.reactants.map(speciesToItem), [reaction]);
  const matched = reactionMatches(reaction, dropped);
  const rate = Math.max(0.1, (temperature / 25) * concentration * Math.sqrt(pressure));
  const neutralizationExercise = interactiveExercises.find((exercise) => exercise.id === "reaction-neutralization");

  const center = (
    <Card>
      <CardContent className="space-y-4 p-4">
        <ZoomableVisual
          title={simulation.title}
          parameters={{ temperature, pressure, concentration }}
          setParameters={(key, value) => {
            if (key === "temperature") setTemperature(value);
            if (key === "pressure") setPressure(value);
            if (key === "concentration") setConcentration(value);
          }}
          parameterDefs={[
            { key: "temperature", label: "Temperature", unit: "C", min: 0, max: 120, defaultValue: 25, step: 1 },
            { key: "pressure", label: "Pressure", unit: "atm", min: 0.5, max: 5, defaultValue: 1, step: 0.1 },
            { key: "concentration", label: "Concentration", unit: "relative", min: 0.2, max: 3, defaultValue: 1, step: 0.1 }
          ]}
          subject={simulation.subject}
          safetyNote={simulation.safetyNote}
          instructions={[
            "Chọn một phản ứng hóa học từ danh sách phản ứng.",
            "Kéo các chất phản ứng yêu cầu từ danh sách vào bình phản ứng.",
            "Thay đổi nhiệt độ, áp suất và nồng độ chất để điều chỉnh tốc độ phản ứng tương đối.",
            "Nhấp 'Start reaction' để khởi chạy va chạm và quan sát liên kết bị phá vỡ/tạo mới sinh ra sản phẩm."
          ]}
        >
          <DragDropLabCanvas
            items={palette}
            dropped={dropped}
            onDropItem={(item) => setDropped((current) => current.some((existing) => existing.id === item.id) ? current : [...current, item])}
            onClear={() => {
              setDropped([]);
              setRunning(false);
            }}
            title="Reaction vessel"
          >
            <MoleculeCollisionView reaction={reaction} running={running && matched} temperature={temperature} concentration={concentration} />
          </DragDropLabCanvas>
        </ZoomableVisual>
        <div className="flex flex-wrap gap-2">
          <Button disabled={!matched} onClick={() => setRunning(true)}><Play className="h-4 w-4" /> {t("simStartReaction")}</Button>
          <Button variant="secondary" onClick={() => { setDropped([]); setRunning(false); }}><RotateCcw className="h-4 w-4" /> {t("simReset")}</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <LabWorkspace
      simulation={simulation}
      formula={reaction.balancedEquation}
      instructions={[
        "Choose a safe conceptual reaction.",
        "Drag the required reactants into the vessel.",
        "Change conditions, start the reaction, and inspect products and bond changes."
      ]}
      center={center}
      leftPanel={<SimulationAssumptionNotice realEquation={reaction.balancedEquation} approximation="Particles collide in a conceptual 2D vessel; rate scales with temperature, concentration and pressure." limitations="No real quantities, hazardous procedures or preparation ratios are provided." />}
      rightPanel={
        <>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Reaction</p>
            {reactionSimulations.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setReaction(item);
                  setDropped([]);
                  setRunning(false);
                }}
                className={`w-full rounded-md border p-2 text-left text-sm ${item.id === reaction.id ? "border-primary bg-muted" : "border-border hover:bg-muted"}`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <ParameterSlider parameter={{ key: "temperature", label: "Temperature", unit: "C", min: 0, max: 120, defaultValue: 25, step: 1 }} value={temperature} onChange={setTemperature} />
          <ParameterSlider parameter={{ key: "pressure", label: "Pressure", unit: "atm", min: 0.5, max: 5, defaultValue: 1, step: 0.1 }} value={pressure} onChange={setPressure} />
          <ParameterSlider parameter={{ key: "concentration", label: "Concentration", unit: "relative", min: 0.2, max: 3, defaultValue: 1, step: 0.1 }} value={concentration} onChange={setConcentration} />
          <div className={`rounded-md p-3 text-sm ${matched ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}>
            {matched ? "Reactants match. You can start the reaction." : "Drop the exact reactants shown in the palette."}
          </div>
        </>
      }
      bottomPanel={
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-2 font-semibold"><FlaskConical className="h-4 w-4" /> Reaction feedback</div>
              <p className="text-sm text-muted-foreground">{reaction.explanation}</p>
              <ResultPanel results={{ "Relative rate": rate, "Safety level": reaction.safetyLevel, "Balanced equation": reaction.balancedEquation }} />
              {running && matched ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-border p-3 text-sm">
                    <p className="font-semibold">Broken bonds</p>
                    <p className="mt-1 text-muted-foreground">{reaction.bondChanges.brokenBonds.map((bond) => `${bond.from}-${bond.to}`).join(", ") || "none"}</p>
                  </div>
                  <div className="rounded-md border border-border p-3 text-sm">
                    <p className="font-semibold">Formed bonds / products</p>
                    <p className="mt-1 text-muted-foreground">{reaction.products.map((item) => item.formula).join(" + ")}</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
          <ReactionEnergyProfile reaction={reaction} />
          {neutralizationExercise && reaction.id === "acid-base-neutralization" ? (
            <div className="lg:col-span-2">
              <InteractiveExperimentExercise
                exercise={neutralizationExercise}
                input={{
                  outcome: {
                    productFormula: running && matched ? reaction.products.map((item) => item.formula) : [],
                    balancedEquation: running && matched ? reaction.balancedEquation : ""
                  }
                }}
              />
            </div>
          ) : null}
        </div>
      }
    />
  );
}
