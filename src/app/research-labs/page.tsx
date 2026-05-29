"use client";

import Link from "next/link";
import { researcherRealLabs } from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function ResearchLabsPage() {
  const physicsCount = researcherRealLabs.filter((lab) => lab.subject === "physics").length;
  const chemistryCount = researcherRealLabs.filter((lab) => lab.subject === "chemistry").length;
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <Badge>{t("researchLabsBadge")}</Badge>
        <h1 className="mt-3 text-3xl font-semibold">{t("researchLabsTitle")}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          {t("researchLabsSubtitle")}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/research-labs/physics"><Button variant="secondary">{t("researchLabsPhysics")} ({physicsCount})</Button></Link>
        <Link href="/research-labs/chemistry"><Button variant="secondary">{t("researchLabsChemistry")} ({chemistryCount})</Button></Link>
        <Link href="/history/experiments"><Button variant="secondary">{t("researchLabsHistoryExperiments")}</Button></Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {researcherRealLabs.map((lab) => (
          <Link key={lab.id} href={`/research-labs/${lab.slug}`}>
            <Card className="h-full hover:bg-muted/50">
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  <Badge>{lab.subject}</Badge>
                  <Badge>{lab.accuracyLevel}</Badge>
                </div>
                <CardTitle>{lab.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{lab.subtitle}</p>
                <p>{lab.researcherNames.join(", ")} - {lab.period}</p>
                <p>{lab.coreQuestion}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
