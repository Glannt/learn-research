import { notFound } from "next/navigation";
import { exercises, formulaDetails, formulas, getLesson, lessonInlineLabs, lessonMiniExercises, simulations } from "@/data/catalog";
import { LessonViewer } from "@/components/lesson/lesson-viewer";

export default async function LessonDetailPage({ params }: { params: Promise<{ slug: string; lessonSlug: string }> }) {
  const { slug, lessonSlug } = await params;
  const lesson = getLesson(slug, lessonSlug);
  if (!lesson) notFound();
  const relatedFormulas = formulas.filter((formula) => lesson.formulas.includes(formula.id));
  const relatedFormulaDetails = formulaDetails.filter((formula) => lesson.formulas.includes(formula.id) || formula.relatedLessonIds.includes(lesson.id));
  const relatedInlineLabs = lessonInlineLabs.filter((lab) => lab.lessonId === lesson.id);
  const relatedMiniExercises = lessonMiniExercises.filter((exercise) => exercise.lessonId === lesson.id);
  const relatedSimulations = simulations.filter((simulation) => lesson.simulations.includes(simulation.id));
  const relatedExercises = exercises.filter((exercise) => exercise.lessonId === lesson.id);
  return (
    <LessonViewer
      lesson={lesson}
      formulas={relatedFormulas}
      formulaDetails={relatedFormulaDetails}
      inlineLabs={relatedInlineLabs}
      miniExercises={relatedMiniExercises}
      simulations={relatedSimulations}
      exercises={relatedExercises}
    />
  );
}
