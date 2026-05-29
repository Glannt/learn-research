import { researcherRealLabs } from "@/data/catalog";
import { ResearchLabList } from "@/components/research-labs/research-lab-list";

export default function HistoryExperimentsPage() {
  return <ResearchLabList labs={researcherRealLabs} />;
}
