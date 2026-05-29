import { notFound } from "next/navigation";
import { getResearcherRealLab } from "@/data/catalog";
import { ResearchLabPage } from "@/components/research-labs/research-lab-components";

export default async function ResearchLabDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = getResearcherRealLab(slug);
  if (!lab) notFound();

  return <ResearchLabPage lab={lab} />;
}
