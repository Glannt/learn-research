import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Subject } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link href={`/subjects/${subject.slug}`}>
      <Card className="h-full overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
        <div className={cn("h-2 bg-gradient-to-r", subject.accent)} />
        <CardHeader>
          <CardTitle>{subject.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="min-h-16 text-sm text-muted-foreground">{subject.description}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            Vào lộ trình <ArrowRight className="h-4 w-4" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
