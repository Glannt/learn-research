import { researcherRealLabs } from "@/data/catalog";
import { ResearchLabList } from "@/components/research-labs/research-lab-list";

export default function ChemistryResearchLabsPage() {
  return <ResearchLabList subject="chemistry" labs={researcherRealLabs.filter((lab) => lab.subject === "chemistry")} />;
}
