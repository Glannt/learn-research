import { notFound } from "next/navigation";
import { getSimulation } from "@/data/catalog";
import { SimulationHost } from "@/components/simulation/simulation-host";

export default async function LabDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const simulation = getSimulation(slug);
  if (!simulation) notFound();
  return <SimulationHost simulation={simulation} />;
}
