"use client";

import React, { useState, useEffect } from "react";
import { scienceHistoryTopics } from "@/data/catalog";
import { ScienceTimeline } from "@/components/history/science-timeline";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function PhysicsHistoryPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-5 animate-pulse">
        <div>
          <div className="h-10 w-64 bg-muted rounded"></div>
          <div className="h-6 w-[500px] bg-muted rounded mt-2"></div>
        </div>
        <div className="h-[400px] bg-muted rounded mt-5"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">{t("historyPhysicsTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("historyPhysicsDesc")}</p>
      </div>
      <ScienceTimeline topics={scienceHistoryTopics} subject="physics" />
    </div>
  );
}
