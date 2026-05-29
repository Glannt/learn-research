"use client";
 
import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormulaDetail, LessonInlineLab as LessonInlineLabType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormulaMath } from "@/components/formula/formula-math";
import { InlineLabSceneRenderer } from "@/components/lesson/inline-lab/inline-lab-scene-renderer";
import { MiniExerciseCard } from "@/components/lesson/inline-lab/mini-exercise-card";
import { ParameterFlowDiagram } from "@/components/lesson/inline-lab/parameter-flow-diagram";
import { ZoomableVisual } from "@/components/simulation/zoom/zoomable-visual";
import { useI18n } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";

export function InlineLabStepPlayer({
  lab,
  currentStep,
  onStepChange
}: {
  lab: LessonInlineLabType;
  currentStep: number;
  onStepChange: (step: number) => void;
}) {
  const step = lab.steps[currentStep] ?? lab.steps[0];
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{t("inlineLabFlowGuide")}</CardTitle>
          <Badge>{t("inlineLabStep")} {step.order}/{lab.steps.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <p className="font-semibold">{step.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{step.explanation}</p>
          {step.formulaFocus ? <p className="mt-2 text-xs text-muted-foreground">{t("inlineLabFormulaFocus")}: {step.formulaFocus}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {lab.steps.map((item, index) => (
            <Button key={item.order} type="button" size="sm" variant={index === currentStep ? "primary" : "secondary"} onClick={() => onStepChange(index)}>
              {item.order}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function InlineLabRelatedSimulationLink({ lab }: { lab: LessonInlineLabType }) {
  const { t } = useI18n();
  if (!lab.relatedSimulationLabId) return null;
  return (
    <Link href={`/lab/${lab.relatedSimulationLabId}`} className="block rounded-lg border border-border bg-card p-4 text-sm font-medium hover:bg-muted">
      {t("inlineLabOpenAdvanced")}: {lab.relatedSimulationLabId}
    </Link>
  );
}

export function LessonInlineLab({ lab, formulaDetails }: { lab: LessonInlineLabType; formulaDetails: FormulaDetail[] }) {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedObjectId, setSelectedObjectId] = useState<string | undefined>();
  const step = lab.steps[currentStep] ?? lab.steps[0];
  const formulas = useMemo(() => formulaDetails.filter((detail) => lab.formulaIds.includes(detail.id)), [formulaDetails, lab.formulaIds]);
  const selected = useMemo(() => lab.visualScene.objects.find((object) => object.id === selectedObjectId), [lab.visualScene.objects, selectedObjectId]);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Lesson Inline Lab</Badge>
            <Badge>{lab.mode}</Badge>
            <Badge>{lab.labType}</Badge>
          </div>
          <h2 className="mt-3 text-2xl font-semibold">{lab.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{lab.description}</p>
        </div>
        <div className="rounded-lg bg-muted p-3 text-sm">
          {formulas.map((detail) => (
            <div key={detail.id} className="text-center">
              <FormulaMath latex={detail.latex} inline />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <ZoomableVisual
            title={lab.title}
            subject={formulas[0]?.subject}
            instructions={lab.steps.map((s) => `${t("inlineLabStep")} ${s.order}: ${s.title} - ${s.explanation}`)}
            customSidebarTitle={t("inlineLabParameterFlow")}
            customSidebarContent={
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <h4 className="font-semibold text-white mb-2 text-sm">{t("inlineLabSelectedObject")}</h4>
                  {selected ? (
                    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-100">
                      <p className="font-semibold text-sky-400 text-sm">{selected.label}</p>
                      <p className="mt-1 text-slate-400 leading-relaxed">{selected.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-800">
                        <span className="text-slate-400">{t("inlineLabBoundParameters")}:</span>
                        {selected.boundParameters.length ? (
                          selected.boundParameters.map(symbol => (
                            <span key={symbol} className="rounded bg-sky-950 px-2 py-0.5 font-mono text-[10px] text-sky-400 font-bold border border-sky-850">{symbol}</span>
                          ))
                        ) : (
                          <span className="italic text-slate-500">{t("inlineLabNoBoundParameters")}</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic text-center py-2">{t("inlineLabSelectObjectHint")}</p>
                  )}
                </div>
                
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <h4 className="font-semibold text-white mb-3 text-sm">{t("inlineLabModelParameters")}</h4>
                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                    {lab.parameterBindings.map((binding) => {
                      const isActive = step.highlightParameterSymbols.includes(binding.parameterSymbol);
                      const isSelected = selectedObjectId && (binding.sourceObjectId === selectedObjectId || binding.targetObjectId === selectedObjectId);
                      return (
                        <button
                          key={`${binding.formulaId}-${binding.parameterSymbol}-${binding.flowOrder}`}
                          type="button"
                          className={cn(
                            "w-full rounded-lg border border-slate-850 p-3 text-left transition-all duration-200 hover:bg-slate-900/80 hover:scale-[1.01] text-xs",
                            isSelected && "border-primary bg-primary/5 ring-1 ring-primary/20",
                            isActive && !isSelected && "border-amber-500 bg-amber-500/5"
                          )}
                          onClick={() => setSelectedObjectId(binding.sourceObjectId === "formula-node" ? binding.targetObjectId : binding.sourceObjectId)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold flex items-center gap-1.5">
                              <span className={cn(
                                "rounded-full px-1.5 py-0.5 text-[10px] font-mono font-bold border",
                                binding.sourceObjectId === "formula-node" 
                                  ? "bg-amber-950/40 text-amber-300 border-amber-900/60" 
                                  : "bg-sky-950/40 text-sky-300 border-sky-900/60"
                              )}>
                                {binding.parameterSymbol}
                              </span>
                              <span className="text-[11px] font-medium text-slate-200 truncate max-w-[130px]">{binding.parameterName}</span>
                            </p>
                            {isActive && (
                              <span className="inline-flex items-center rounded-full bg-amber-950/40 px-1.5 py-0.5 text-[9px] font-semibold text-amber-400 border border-amber-900/30">
                                {t("inlineLabActive")}
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-[10px] text-slate-400 leading-normal">{binding.explanation}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            }
          >
            <InlineLabSceneRenderer
              lab={lab}
              formulaDetails={formulas}
              activeObjectIds={step.highlightObjectIds}
              activeSymbols={step.highlightParameterSymbols}
              selectedObjectId={selectedObjectId}
              onSelectObject={setSelectedObjectId}
            />
          </ZoomableVisual>
          <ParameterFlowDiagram bindings={lab.parameterBindings} formulaIds={lab.formulaIds} />
        </div>
        <div className="space-y-5">
          <InlineLabStepPlayer lab={lab} currentStep={currentStep} onStepChange={setCurrentStep} />
          
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{t("inlineLabSelectedObject")}</CardTitle>
            </CardHeader>
            <CardContent>
              {selected ? (
                <div className="rounded-lg border border-border bg-muted/40 p-3.5 text-sm transition-all duration-200">
                  <p className="font-semibold text-primary text-base">{selected.label}</p>
                  <p className="mt-1.5 text-muted-foreground leading-relaxed text-xs">{selected.description}</p>
                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground pt-3 border-t border-border">
                    <span className="font-medium">{t("inlineLabBoundParameters")}:</span>
                    {selected.boundParameters.length ? (
                      selected.boundParameters.map(symbol => (
                        <span key={symbol} className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary font-bold">{symbol}</span>
                      ))
                    ) : (
                      <span className="italic">{t("inlineLabNoBoundParameters")}</span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic text-center py-4">{t("inlineLabSelectObjectDetailHint")}</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{t("inlineLabModelParameters")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm max-h-[400px] overflow-y-auto pr-1">
              {lab.parameterBindings.map((binding) => {
                const isActive = step.highlightParameterSymbols.includes(binding.parameterSymbol);
                const isSelected = selectedObjectId && (binding.sourceObjectId === selectedObjectId || binding.targetObjectId === selectedObjectId);
                return (
                  <button
                    key={`${binding.formulaId}-${binding.parameterSymbol}-${binding.flowOrder}`}
                    type="button"
                    className={cn(
                      "w-full rounded-lg border border-border p-3 text-left transition-all duration-200 hover:bg-muted/80 hover:scale-[1.01] hover:shadow-sm",
                      isSelected && "border-primary bg-primary/5 ring-1 ring-primary/30",
                      isActive && !isSelected && "border-amber-500 bg-amber-500/5"
                    )}
                    onClick={() => setSelectedObjectId(binding.sourceObjectId === "formula-node" ? binding.targetObjectId : binding.sourceObjectId)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold flex items-center gap-2">
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-mono font-bold border",
                          binding.sourceObjectId === "formula-node" 
                            ? "bg-amber-100 text-amber-950 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60" 
                            : "bg-sky-100 text-sky-950 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/60"
                        )}>
                          {binding.parameterSymbol}
                        </span>
                        <span className="text-xs font-medium truncate max-w-[120px]">{binding.parameterName}</span>
                      </p>
                      {isActive && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          {t("inlineLabActive")}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground leading-normal">{binding.explanation}</p>
                  </button>
                );
              })}
            </CardContent>
          </Card>
          <InlineLabRelatedSimulationLink lab={lab} />
        </div>
      </div>
      <MiniExerciseCard exercise={lab.miniExercise} selectedObjectId={selectedObjectId} onSelectObject={setSelectedObjectId} />
    </section>
  );
}
