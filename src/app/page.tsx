import Link from "next/link";
import { ArrowRight, FlaskConical, Sigma, Sparkles } from "lucide-react";
import { formulas, lessons, simulations, subjects } from "@/data/catalog";
import { SubjectCard } from "@/components/lesson/subject-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const paths = ["Cơ bản", "Trung cấp", "Nâng cao", "Ứng dụng thực tế"];
const featuredLabs = ["pendulum", "kinematics", "newton-law", "atom-model", "chemical-bonding", "ideal-gas", "reaction-temperature", "molecule-viewer"];

export default function HomePage() {
  const labs = simulations.filter((simulation) => featuredLabs.includes(simulation.slug));
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_420px]">
          <div className="flex flex-col justify-center">
            <Badge className="w-fit">MVP học Hóa học và Vật lý tương tác</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal md:text-5xl">
              Học công thức qua mô phỏng, bài tập và dữ liệu trực quan.
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Lộ trình từ cơ bản đến nâng cao cho Vật lý và Hóa học, có công thức LaTeX, calculator, quiz và lab 2D/3D chạy local.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/subjects"><Button>Bắt đầu học <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/lab"><Button variant="secondary">Mở lab mô phỏng</Button></Link>
            </div>
          </div>
          <div className="rounded-lg bg-slate-950 p-4 text-white">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-blue-500/20 p-4">
                <Sigma className="h-5 w-5" />
                <p className="mt-3 text-2xl font-semibold">{formulas.length}</p>
                <p className="text-sm text-slate-300">công thức mẫu</p>
              </div>
              <div className="rounded-md bg-emerald-500/20 p-4">
                <FlaskConical className="h-5 w-5" />
                <p className="mt-3 text-2xl font-semibold">{simulations.length}</p>
                <p className="text-sm text-slate-300">mô phỏng</p>
              </div>
              <div className="col-span-2 rounded-md bg-violet-500/20 p-4">
                <Sparkles className="h-5 w-5" />
                <p className="mt-3 text-2xl font-semibold">{lessons.length} bài học + 100 bài tập</p>
                <p className="text-sm text-slate-300">thiết kế để mở rộng thành LMS hoàn chỉnh.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} />)}
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {paths.map((path) => (
          <Card key={path}>
            <CardHeader><CardTitle>{path}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Lộ trình có bài học, công thức, ví dụ, bài tập và mô phỏng liên quan.</CardContent>
          </Card>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Mô phỏng nổi bật</h2>
            <p className="text-sm text-muted-foreground">Có slider tham số, canvas/3D viewport và kết quả realtime.</p>
          </div>
          <Link href="/lab" className="text-sm font-medium text-primary">Xem tất cả</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {labs.map((lab) => (
            <Link key={lab.id} href={`/lab/${lab.slug}`}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader>
                  <div className="flex gap-2"><Badge>{lab.subject === "physics" ? "Vật lý" : "Hóa học"}</Badge><Badge>{lab.dimension}</Badge></div>
                  <CardTitle>{lab.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{lab.description}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
