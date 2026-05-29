import Link from "next/link";
import type { Chapter, Lesson, SubjectKey } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChapterList({ chapters, lessons, subject }: { chapters: Chapter[]; lessons: Lesson[]; subject: SubjectKey }) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter) => {
        const chapterLessons = lessons.filter((lesson) => lesson.chapterId === chapter.id);
        return (
          <Card key={chapter.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>{chapter.title}</CardTitle>
                <Badge>{chapter.level}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{chapter.summary}</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                {chapterLessons.map((lesson) => (
                  <Link key={lesson.id} href={`/subjects/${subject}/lessons/${lesson.slug}`} className="rounded-md border border-border p-3 transition hover:bg-muted">
                    <p className="font-medium">{lesson.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{lesson.durationMinutes} phút • {lesson.summary}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
