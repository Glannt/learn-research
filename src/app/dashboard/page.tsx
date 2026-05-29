import { ProgressDashboard } from "@/components/quiz/progress-dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard học tập</h1>
        <p className="mt-2 text-muted-foreground">Theo dõi bài đã học, công thức đã lưu, mô phỏng đã thử và kết quả quiz gần đây.</p>
      </div>
      <ProgressDashboard />
    </div>
  );
}
