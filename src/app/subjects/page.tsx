import { subjects } from "@/data/catalog";
import { SubjectCard } from "@/components/lesson/subject-card";

export default function SubjectsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Môn học</h1>
        <p className="mt-2 text-muted-foreground">Chọn Vật lý hoặc Hóa học để xem chương, bài học, công thức và lab liên quan.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} />)}
      </div>
    </div>
  );
}
