import { notFound } from "next/navigation";
import { scienceHistoryTopics } from "@/data/catalog";
import { HistoryTopicClient } from "@/components/history/history-topic-client";

export default async function HistoryTopicPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  const topic = scienceHistoryTopics.find((item) => item.id === topicSlug);
  if (!topic) notFound();

  return <HistoryTopicClient topic={topic} />;
}
