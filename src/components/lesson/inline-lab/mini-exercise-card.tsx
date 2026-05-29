"use client";

import { useMemo, useState } from "react";
import type { LessonMiniExercise } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function normalize(value: string | number | undefined) {
  return String(value ?? "").trim().toLowerCase();
}

export function validateMiniExercise(exercise: LessonMiniExercise, value: string, unit: string, selectedObjectId: string) {
  const expected = exercise.expectedAnswer;
  const valueText = normalize(value);
  const expectedText = normalize(expected.value);
  const expectedNumber = typeof expected.value === "number" ? expected.value : Number.NaN;
  const typedNumber = Number(value);
  const valueOk = Number.isFinite(expectedNumber)
    ? Number.isFinite(typedNumber) && Math.abs(typedNumber - expectedNumber) <= (exercise.tolerance ?? 0)
    : valueText === expectedText || valueText.includes(expectedText);
  const unitOk = !expected.unit || normalize(unit) === normalize(expected.unit);
  const objectOk = !expected.selectedObjectId || selectedObjectId === expected.selectedObjectId;

  return {
    ok: valueOk && unitOk && objectOk,
    valueOk,
    unitOk,
    objectOk
  };
}

export function SceneBasedAnswerInput({ value, unit, onValueChange, onUnitChange }: { value: string; unit: string; onValueChange: (value: string) => void; onUnitChange: (value: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
      <Input value={value} onChange={(event) => onValueChange(event.target.value)} placeholder="Nhập kết quả hoặc nhận xét" />
      <Input value={unit} onChange={(event) => onUnitChange(event.target.value)} placeholder="Đơn vị" />
    </div>
  );
}

export function ObjectSelectionQuestion({ objectIds, selectedObjectId, onSelect }: { objectIds: string[]; selectedObjectId: string; onSelect: (objectId: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {objectIds.map((objectId) => (
        <Button key={objectId} type="button" variant={selectedObjectId === objectId ? "primary" : "secondary"} size="sm" onClick={() => onSelect(objectId)}>
          {objectId}
        </Button>
      ))}
    </div>
  );
}

export function FormulaParameterFillQuestion({ parameterSymbol }: { parameterSymbol?: string }) {
  if (!parameterSymbol) return null;
  return <p className="text-sm text-muted-foreground">Tham số cần xác định: <span className="font-semibold text-foreground">{parameterSymbol}</span></p>;
}

export function UnitSelectionQuestion({ expectedUnit }: { expectedUnit?: string }) {
  if (!expectedUnit) return null;
  return <p className="text-xs text-muted-foreground">Đơn vị mục tiêu: {expectedUnit}</p>;
}

export function MiniExerciseCard({ exercise, selectedObjectId, onSelectObject }: { exercise: LessonMiniExercise; selectedObjectId?: string; onSelectObject?: (objectId: string) => void }) {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState(exercise.expectedAnswer.unit ?? "");
  const [localSelectedObjectId, setLocalSelectedObjectId] = useState(selectedObjectId ?? "");
  const [checked, setChecked] = useState(false);
  const validation = useMemo(() => validateMiniExercise(exercise, value, unit, selectedObjectId ?? localSelectedObjectId), [exercise, value, unit, selectedObjectId, localSelectedObjectId]);

  const objectIds = exercise.sceneData?.visualObjectIds ?? [];
  const currentObjectId = selectedObjectId ?? localSelectedObjectId;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{exercise.title}</CardTitle>
          <Badge>{exercise.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{exercise.prompt}</p>
        <FormulaParameterFillQuestion parameterSymbol={exercise.expectedAnswer.parameterSymbol} />
        <ObjectSelectionQuestion
          objectIds={objectIds}
          selectedObjectId={currentObjectId}
          onSelect={(objectId) => {
            setLocalSelectedObjectId(objectId);
            onSelectObject?.(objectId);
          }}
        />
        <SceneBasedAnswerInput value={value} unit={unit} onValueChange={setValue} onUnitChange={setUnit} />
        <UnitSelectionQuestion expectedUnit={exercise.expectedAnswer.unit} />
        <Button type="button" onClick={() => setChecked(true)}>Kiểm tra</Button>
        {checked ? (
          <div className={validation.ok ? "rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100" : "rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-500/10 dark:text-amber-100"}>
            <p className="font-semibold">{validation.ok ? "Đúng" : "Cần kiểm tra lại"}</p>
            <p className="mt-1">{exercise.explanation}</p>
            {!validation.ok ? (
              <p className="mt-2 text-xs">Kiểm tra: kết quả {validation.valueOk ? "đúng" : "chưa đúng"}, đơn vị {validation.unitOk ? "đúng" : "chưa đúng"}, object {validation.objectOk ? "đúng" : "chưa đúng"}.</p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
