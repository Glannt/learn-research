"use client";

import Link from "next/link";
import type { ScienceHistoryTopic, SubjectKey } from "@/types";
import { useI18n } from "@/lib/i18n/use-i18n";
import { getLocalizedTopic } from "@/lib/i18n/history-dictionary";

export function ScienceTimeline({ topics, subject }: { topics: ScienceHistoryTopic[]; subject?: SubjectKey }) {
  const { locale } = useI18n();
  const filtered = subject ? topics.filter((topic) => topic.subject === subject) : topics;

  return (
    <div className="space-y-3">
      {filtered.map((item) => {
        const topic = getLocalizedTopic(item, locale);
        return (
          <Link key={topic.id} href={`/history/${topic.id}`} className="grid gap-3 rounded-lg border border-border bg-card p-4 transition hover:bg-muted md:grid-cols-[140px_1fr] hover:shadow-sm">
            <div className="text-sm font-semibold text-primary">{topic.period}</div>
            <div>
              <p className="font-semibold">{topic.title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground leading-normal">{topic.summary}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
