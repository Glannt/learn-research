import { researcherRealLabs } from "@/data/catalog";
import { ResearchLabList } from "@/components/research-labs/research-lab-list";

export default function PhysicsResearchLabsPage() {
  return <ResearchLabList subject="physics" labs={researcherRealLabs.filter((lab) => lab.subject === "physics")} />;
}
