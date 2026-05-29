"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import type { Exercise } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProgressStore } from "@/features/progress/progress-store";

export function QuizCard({ exercise }: { exercise: Exercise }) {
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const answerQuiz = useProgressStore((state) => state.answerQuiz);
  const correct = checked && selected === exercise.answer;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">{exercise.question}</CardTitle>
          <Badge>{exercise.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {exercise.options?.map((option) => (
          <button
            key={option}
            className={`w-full rounded-md border p-3 text-left text-sm transition ${selected === option ? "border-primary bg-muted" : "border-border hover:bg-muted"}`}
            onClick={() => {
              setSelected(option);
              setChecked(false);
            }}
          >
            {option}
          </button>
        ))}
        <Button
          disabled={!selected}
          onClick={() => {
            setChecked(true);
            answerQuiz(exercise.id, selected === exercise.answer);
          }}
        >
          Kiểm tra
        </Button>
        {checked ? (
          <div className={`rounded-md p-3 text-sm ${correct ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-red-500/10 text-red-700 dark:text-red-300"}`}>
            <div className="mb-1 flex items-center gap-2 font-medium">
              {correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {correct ? "Đúng" : `Chưa đúng. Đáp án: ${exercise.answer}`}
            </div>
            <p>{exercise.explanation}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
