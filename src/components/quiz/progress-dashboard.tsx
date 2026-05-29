"use client";

import Link from "next/link";
import { Activity, Bookmark, FlaskConical, GraduationCap } from "lucide-react";
import { exercises, formulas, lessons, simulations } from "@/data/catalog";
import { useProgressStore } from "@/features/progress/progress-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProgressDashboard() {
  const { completedLessons, triedSimulations, savedFormulas, quizResults } = useProgressStore();
  const physicsDone = completedLessons.filter((id) => lessons.find((lesson) => lesson.id === id)?.subject === "physics").length;
  const chemistryDone = completedLessons.filter((id) => lessons.find((lesson) => lesson.id === id)?.subject === "chemistry").length;
  const correctQuiz = Object.values(quizResults).filter(Boolean).length;

  const stats = [
    { label: "Bài đã học", value: completedLessons.length, icon: GraduationCap },
    { label: "Công thức đã lưu", value: savedFormulas.length, icon: Bookmark },
    { label: "Mô phỏng đã thử", value: triedSimulations.length, icon: FlaskConical },
    { label: "Quiz đúng", value: correctQuiz, icon: Activity }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-muted">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tiến độ từng môn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm"><span>Vật lý</span><span>{physicsDone}/20</span></div>
              <Progress value={(physicsDone / 20) * 100} />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm"><span>Hóa học</span><span>{chemistryDone}/20</span></div>
              <Progress value={(chemistryDone / 20) * 100} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gợi ý tiếp theo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Link href="/subjects/physics/lessons/dinh-luat-newton" className="block rounded-md border border-border p-3 hover:bg-muted">Định luật Newton và lực ma sát</Link>
            <Link href="/lab/molecule-viewer" className="block rounded-md border border-border p-3 hover:bg-muted">Molecule Viewer 3D</Link>
            <Link href="/formulas/chemistry/ph" className="block rounded-md border border-border p-3 hover:bg-muted">Tra cứu pH</Link>
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground">Dataset hiện có: {lessons.length} bài học, {formulas.length} công thức, {simulations.length} mô phỏng, {exercises.length} bài tập.</p>
    </div>
  );
}
