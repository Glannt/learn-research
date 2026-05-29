import Link from "next/link";
import type { Exercise, Formula, FormulaDetail, Lesson, LessonInlineLab as LessonInlineLabType, LessonMiniExercise, Simulation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormulaExplanationPanel, FormulaParameterTable, FormulaVisualBindingMap } from "@/components/formula/formula-detail-panels";
import { LessonFormulaBlock } from "@/components/lesson/lesson-formula-block";
import { LessonInlineLab } from "@/components/lesson/inline-lab/lesson-inline-lab";

type LessonViewerProps = {
  lesson: Lesson;
  formulas: Formula[];
  formulaDetails?: FormulaDetail[];
  inlineLabs?: LessonInlineLabType[];
  miniExercises?: LessonMiniExercise[];
  simulations: Simulation[];
  exercises: Exercise[];
};

export function LessonViewer({
  lesson,
  formulas,
  formulaDetails = [],
  inlineLabs = [],
  miniExercises = [],
  simulations,
  exercises
}: LessonViewerProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <article className="space-y-6">
        <div>
          <Badge>{lesson.level}</Badge>
          <h1 className="mt-3 text-3xl font-semibold">{lesson.title}</h1>
          <p className="mt-3 text-muted-foreground">{lesson.content}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mục tiêu học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>1. Xác định đại lượng chính và điều kiện áp dụng.</p>
            <p>2. Nhìn thấy tham số nằm ở đâu trên hình hoặc mô hình.</p>
            <p>3. Đi theo flow: input → công thức → output → kiểm chứng bằng mini exercise.</p>
          </CardContent>
        </Card>

        <LessonFormulaBlock formulas={formulas} formulaDetails={formulaDetails} />

        {formulaDetails.length ? (
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">Giải thích tham số công thức</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Mỗi biến được gắn với một object cụ thể trong mô hình để công thức không bị tách khỏi hiện tượng.
              </p>
            </div>
            {formulaDetails.map((detail) => (
              <div key={detail.id} className="space-y-4 rounded-xl border border-border bg-card p-4">
                <FormulaExplanationPanel detail={detail} />
                <FormulaParameterTable detail={detail} />
                <FormulaVisualBindingMap detail={detail} />
              </div>
            ))}
          </section>
        ) : null}

        {inlineLabs.length ? (
          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold">Inline lab trong bài học</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Lab này là mô hình minh họa theo flow cố định. Trang `/lab` vẫn là nơi thực hành nâng cao với nhiều tham số hơn.
              </p>
            </div>
            {inlineLabs.map((lab) => (
              <LessonInlineLab key={lab.id} lab={lab} formulaDetails={formulaDetails} />
            ))}
          </section>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Inline lab</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Bài này chưa có inline lab riêng. Có thể dùng lab nâng cao trong thanh bên để thực hành thêm.
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt bài</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>- Công thức chỉ có ý nghĩa khi biết biến nào là input, biến nào là output.</p>
            <p>- Đơn vị phải nhất quán trước khi thay số.</p>
            <p>- Inline lab giúp kiểm tra trực quan output có hợp lý với hiện tượng hay không.</p>
          </CardContent>
        </Card>
      </article>

      <aside className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Lab nâng cao</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {simulations.map((simulation) => (
              <Link key={simulation.id} href={`/lab/${simulation.slug}`} className="block rounded-md border border-border p-3 text-sm hover:bg-muted">
                {simulation.title}
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mini exercise trong bài</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {miniExercises.length ? miniExercises.slice(0, 4).map((exercise) => (
              <div key={exercise.id} className="rounded-md border border-border p-3 text-sm">
                <p className="font-medium">{exercise.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{exercise.prompt}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">Chưa có mini exercise cho bài này.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bài tập mẫu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {exercises.slice(0, 3).map((exercise) => (
              <div key={exercise.id} className="rounded-md border border-border p-3 text-sm">
                <p className="font-medium">{exercise.question}</p>
                <p className="mt-2 text-xs text-muted-foreground">{exercise.difficulty}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
