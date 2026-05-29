"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { scienceHistoryTopics } from "@/data/catalog";
import { ScienceTimeline } from "@/components/history/science-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function HistoryPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-10 w-64 bg-muted rounded"></div>
          <div className="h-6 w-[500px] bg-muted rounded mt-2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-[180px] bg-muted rounded"></div>
          <div className="h-[180px] bg-muted rounded"></div>
        </div>
        <div className="h-[400px] bg-muted rounded mt-6"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{t("historyTitle")}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{t("historyDescription")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t("historyPhysicsTitle")}</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>{t("historyPhysicsDesc")}</p>
            <Link href="/history/physics"><Button>{t("openSimulation")}</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("historyChemistryTitle")}</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>{t("historyChemistryDesc")}</p>
            <Link href="/history/chemistry"><Button>{t("openSimulation")}</Button></Link>
          </CardContent>
        </Card>
      </div>
      <ScienceTimeline topics={scienceHistoryTopics} />
    </div>
  );
}
