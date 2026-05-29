import Link from "next/link";
import { Bookmark, ExternalLink } from "lucide-react";
import type { Formula } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormulaMath } from "@/components/formula/formula-math";

export function FormulaCard({ formula }: { formula: Formula }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge>{formula.subject === "physics" ? "Vật lý" : "Hóa học"}</Badge>
            <CardTitle className="mt-3">{formula.name}</CardTitle>
          </div>
          <Bookmark className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-md bg-muted p-4 text-center">
          <FormulaMath latex={formula.latex} />
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">{formula.description}</p>
        <Link href={`/formulas/${formula.subject}/${formula.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
          Xem chi tiết <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
