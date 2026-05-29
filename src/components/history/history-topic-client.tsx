"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scienceHistoryTopics, simulations } from "@/data/catalog";
import { BeforeAfterTheoryCompare } from "@/components/history/before-after-theory-compare";
import { DiscoveryStoryPanel } from "@/components/history/discovery-story-panel";
import { ExperimentReconstruction } from "@/components/history/experiment-reconstruction";
import { FormulaOriginPanel } from "@/components/history/formula-origin-panel";
import { ScientistCard } from "@/components/history/scientist-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizCard } from "@/components/quiz/quiz-card";
import type { Exercise, ScienceHistoryTopic } from "@/types";
import { useI18n } from "@/lib/i18n/use-i18n";
import { getLocalizedTopic } from "@/lib/i18n/history-dictionary";

function HistorySkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded bg-muted" />
        <div className="h-6 w-20 rounded bg-muted" />
      </div>
      <div className="mt-3 h-10 w-72 rounded bg-muted" />
      <div className="mt-2 h-6 w-full max-w-[500px] rounded bg-muted" />
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="h-[450px] rounded bg-muted" />
        <div className="space-y-5">
          <div className="h-[200px] rounded bg-muted" />
          <div className="h-[200px] rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function HistoryTopicClient({ topic }: { topic: ScienceHistoryTopic }) {
  const { locale, t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const localizedTopic = getLocalizedTopic(topic, locale);
  const relatedLabs = simulations.filter((simulation) => localizedTopic.relatedSimulationIds.includes(simulation.id));

  const quickQuiz: Exercise = {
    id: `history-${localizedTopic.id}`,
    lessonId: localizedTopic.id,
    subject: localizedTopic.subject,
    type: "multiple-choice",
    question:
      locale === "vi"
        ? `Quan sát thực nghiệm chìa khóa trong học phần "${localizedTopic.title}" là gì?`
        : `What was the key observation in "${localizedTopic.title}"?`,
    options: [
      localizedTopic.observation,
      localizedTopic.hypothesis,
      locale === "vi" ? "Mô hình không dựa trên bằng chứng thực nghiệm." : "The model had no experimental evidence.",
      locale === "vi" ? "Công thức được đoán mà không cần kiểm chứng." : "The formula was guessed without testing."
    ],
    answer: localizedTopic.observation,
    explanation: localizedTopic.conclusion,
    difficulty: "easy"
  };

  if (!mounted) return <HistorySkeleton />;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap gap-2">
          <Badge>{localizedTopic.subject === "physics" ? t("subjectPhysics") : t("subjectChemistry")}</Badge>
          <Badge>{localizedTopic.period}</Badge>
        </div>
        <h1 className="mt-3 text-3xl font-semibold">{localizedTopic.title}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{localizedTopic.summary}</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <ExperimentReconstruction topic={localizedTopic} />
          <DiscoveryStoryPanel topic={localizedTopic} />
          <BeforeAfterTheoryCompare topic={localizedTopic} />
          <QuizCard exercise={quickQuiz} />
        </div>
        <aside className="space-y-5">
          <ScientistCard topic={localizedTopic} />
          <FormulaOriginPanel topic={localizedTopic} />
          <Card>
            <CardHeader>
              <CardTitle>{t("relatedLabs")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {relatedLabs.map((lab) => (
                <Link key={lab.id} href={`/lab/${lab.slug}`}>
                  <Button className="w-full" variant="secondary">
                    {t("openSimulation")} {lab.title}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
