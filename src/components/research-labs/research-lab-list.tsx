"use client";

import Link from "next/link";
import type { ResearcherRealLab, SubjectKey } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/use-i18n";

export function ResearchLabList({ labs, subject }: { labs: ResearcherRealLab[]; subject?: SubjectKey }) {
  const { t } = useI18n();
  const title = subject
    ? subject === "physics"
      ? t("researchLabsPhysicsTitle")
      : t("researchLabsChemistryTitle")
    : t("researchLabsListTitle");

  return (
    <div className="space-y-6">
      <div>
        {subject ? <Badge>{subject}</Badge> : <Badge>{t("researchLabsListBadge")}</Badge>}
        <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-muted-foreground">{t("researchLabsListSubtitle")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {labs.map((lab) => (
          <Link key={lab.id} href={`/research-labs/${lab.slug}`}>
            <Card className="h-full hover:bg-muted/50">
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  <Badge>{lab.discoveryType}</Badge>
                  <Badge>{lab.safetyLevel}</Badge>
                </div>
                <CardTitle>{lab.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{lab.subtitle}</p>
                <p>{lab.coreQuestion}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
