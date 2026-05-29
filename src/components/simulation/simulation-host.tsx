"use client";

import dynamic from "next/dynamic";
import type { Simulation } from "@/types";
import { ChemicalBondingSimulation } from "@/components/chemistry/chemical-bonding-simulation";
import { PeriodicTable } from "@/components/chemistry/periodic-table";
import { ReactionTemperatureSimulation } from "@/components/chemistry/reaction-temperature-simulation";
import { ChemicalReactionSandbox } from "@/components/chemistry/sandbox/chemical-reaction-sandbox";
import { SolutionConcentrationSimulation } from "@/components/chemistry/solution-concentration-simulation";
import { IdealGasSimulation } from "@/components/physics/ideal-gas-simulation";
import { ConceptualPhysicsSimulation } from "@/components/physics/conceptual-physics-simulation";
import { KinematicsSimulation } from "@/components/physics/kinematics-simulation";
import { NewtonLawSimulation } from "@/components/physics/newton-law-simulation";
import { PendulumSimulation } from "@/components/physics/pendulum-simulation";
import { Card, CardContent } from "@/components/ui/card";
import { SimulationLayout } from "@/components/simulation/simulation-layout";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { DictionaryKey } from "@/lib/i18n/dictionary";

function SimulationLoading({ labelKey }: { labelKey: DictionaryKey }) {
  const { t } = useI18n();
  return <Card><CardContent className="p-6 text-muted-foreground">{t(labelKey)}</CardContent></Card>;
}

const AtomModel3D = dynamic(() => import("@/components/chemistry/atom-model-3d").then((mod) => mod.AtomModel3D), {
  ssr: false,
  loading: () => <SimulationLoading labelKey="simLoadingAtomModel" />
});

const MoleculeViewer3D = dynamic(() => import("@/components/chemistry/molecule-viewer-3d").then((mod) => mod.MoleculeViewer3D), {
  ssr: false,
  loading: () => <SimulationLoading labelKey="simLoadingMoleculeViewer" />
});

const ACGeneratorLab = dynamic(() => import("@/features/visual-simulation/simulations/ac-generator/ACGeneratorLab").then((mod) => mod.ACGeneratorLab), {
  ssr: false,
  loading: () => <SimulationLoading labelKey="simLoadingAcGenerator" />
});

const FaradayInductionLab = dynamic(() => import("@/features/visual-simulation/simulations/faraday-induction/FaradayInductionLab").then((mod) => mod.FaradayInductionLab), {
  ssr: false,
  loading: () => <SimulationLoading labelKey="simLoadingFaraday" />
});

const TransformerLab = dynamic(() => import("@/features/visual-simulation/simulations/transformer/TransformerLab").then((mod) => mod.TransformerLab), {
  ssr: false,
  loading: () => <SimulationLoading labelKey="simLoadingTransformer" />
});

export function SimulationHost({ simulation }: { simulation: Simulation }) {
  const { t } = useI18n();

  if (simulation.type === "pendulum") return <PendulumSimulation simulation={simulation} />;
  if (simulation.type === "kinematics") return <KinematicsSimulation simulation={simulation} />;
  if (simulation.type === "newton-law") return <NewtonLawSimulation simulation={simulation} />;
  if (simulation.type === "ac-generator") return <ACGeneratorLab simulation={simulation} />;
  if (simulation.type === "faraday-induction") return <FaradayInductionLab simulation={simulation} />;
  if (simulation.type === "transformer") return <TransformerLab simulation={simulation} />;
  if (simulation.type === "conceptual-physics") return <ConceptualPhysicsSimulation simulation={simulation} />;
  if (simulation.type === "ideal-gas") return <IdealGasSimulation simulation={simulation} />;
  if (simulation.slug === "periodic-table") {
    return (
      <SimulationLayout simulation={simulation} parameters={{}} setParameter={() => undefined}>
        <PeriodicTable />
      </SimulationLayout>
    );
  }
  if (simulation.type === "atom-model") return <AtomModel3D simulation={simulation} />;
  if (simulation.type === "molecule-viewer") return <MoleculeViewer3D simulation={simulation} />;
  if (simulation.type === "chemical-bonding") return <ChemicalBondingSimulation simulation={simulation} />;
  if (simulation.type === "reaction-sandbox") return <ChemicalReactionSandbox simulation={simulation} />;
  if (simulation.type === "reaction-temperature") return <ReactionTemperatureSimulation simulation={simulation} />;
  if (simulation.type === "solution-concentration") return <SolutionConcentrationSimulation simulation={simulation} />;

  return (
    <SimulationLayout simulation={simulation} parameters={{}} setParameter={() => undefined}>
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">{t("simUpgradeNextPhase")}</CardContent>
      </Card>
    </SimulationLayout>
  );
}
