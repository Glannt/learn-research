import { exercises } from "@/data/catalog";
import { QuizCard } from "@/components/quiz/quiz-card";

export default function QuizPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Quiz và bài tập</h1>
        <p className="mt-2 text-muted-foreground">Mẫu trắc nghiệm, chọn đơn vị và bài tính toán. Kết quả được lưu trong Zustand store phía client.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {exercises.slice(0, 18).map((exercise) => <QuizCard key={exercise.id} exercise={exercise} />)}
      </div>
    </div>
  );
}
