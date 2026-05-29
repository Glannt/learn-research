import { notFound } from "next/navigation";
import { chapters, getSubject, lessons } from "@/data/catalog";
import { ChapterList } from "@/components/lesson/chapter-list";

export default async function SubjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const subject = getSubject(slug);
  if (!subject) notFound();
  const subjectChapters = chapters.filter((chapter) => chapter.subjectId === subject.slug);
  const subjectLessons = lessons.filter((lesson) => lesson.subject === subject.slug);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">{subject.name}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{subject.description}</p>
      </div>
      <ChapterList chapters={subjectChapters} lessons={subjectLessons} subject={subject.slug} />
    </div>
  );
}
