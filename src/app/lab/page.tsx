"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { simulations } from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Filter = "all" | "physics" | "chemistry" | "2D" | "3D" | "basic" | "advanced";

export default function LabPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const labs = useMemo(() => simulations.filter((simulation) => {
    if (filter === "all") return true;
    if (filter === "physics" || filter === "chemistry") return simulation.subject === filter;
    if (filter === "2D" || filter === "3D") return simulation.dimension === filter;
    return simulation.level === filter;
  }), [filter]);

  const filters: Filter[] = ["all", "physics", "chemistry", "2D", "3D", "basic", "advanced"];
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Lab mô phỏng</h1>
        <p className="mt-2 text-muted-foreground">Các lab 2D/3D có tham số, kết quả realtime và mô hình an toàn cho giáo dục.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => <Button key={item} variant={filter === item ? "primary" : "secondary"} onClick={() => setFilter(item)}>{item}</Button>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {labs.map((lab) => (
          <Link key={lab.id} href={`/lab/${lab.slug}`}>
            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  <Badge>{lab.subject === "physics" ? "Vật lý" : "Hóa học"}</Badge>
                  <Badge>{lab.dimension}</Badge>
                  <Badge>{lab.level}</Badge>
                </div>
                <CardTitle>{lab.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{lab.description}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
