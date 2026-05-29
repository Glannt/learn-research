"use client";

import { Eye, EyeOff, Move3D, Pause, Play, RefreshCw, RotateCcw, SplitSquareHorizontal, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/use-i18n";

export type VisualToggles = {
  labels: boolean;
  fieldLines: boolean;
  currentArrows: boolean;
  formula: boolean;
  exploded: boolean;
  cutaway: boolean;
  autoRotate: boolean;
  playing: boolean;
};

export function OrbitControlToolbar({
  toggles,
  onToggle,
  onResetCamera,
  onResetAnimation
}: {
  toggles: VisualToggles;
  onToggle: (key: keyof VisualToggles) => void;
  onResetCamera: () => void;
  onResetAnimation: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-2">
      <Button type="button" size="sm" variant={toggles.playing ? "primary" : "secondary"} onClick={() => onToggle("playing")}>
        {toggles.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {toggles.playing ? t("simPause") : t("simPlay")}
      </Button>
      <Button type="button" size="sm" variant="secondary" onClick={onResetAnimation}>
        <RotateCcw className="h-4 w-4" />
        {t("simResetAnimation")}
      </Button>
      <Button type="button" size="sm" variant="secondary" onClick={onResetCamera}>
        <Target className="h-4 w-4" />
        {t("simResetCamera")}
      </Button>
      <Button type="button" size="sm" variant={toggles.autoRotate ? "primary" : "secondary"} onClick={() => onToggle("autoRotate")}>
        <RefreshCw className="h-4 w-4" />
        {t("simAutoOrbit")}
      </Button>
      <Button type="button" size="sm" variant={toggles.exploded ? "primary" : "secondary"} onClick={() => onToggle("exploded")}>
        <Move3D className="h-4 w-4" />
        {t("simExplode")}
      </Button>
      <Button type="button" size="sm" variant={toggles.cutaway ? "primary" : "secondary"} onClick={() => onToggle("cutaway")}>
        <SplitSquareHorizontal className="h-4 w-4" />
        {t("simCutaway")}
      </Button>
      <Button type="button" size="sm" variant={toggles.labels ? "primary" : "secondary"} onClick={() => onToggle("labels")}>
        {toggles.labels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        {t("simLabels")}
      </Button>
      <Button type="button" size="sm" variant={toggles.fieldLines ? "primary" : "secondary"} onClick={() => onToggle("fieldLines")}>
        <Zap className="h-4 w-4" />
        {t("simField")}
      </Button>
      <Button type="button" size="sm" variant={toggles.currentArrows ? "primary" : "secondary"} onClick={() => onToggle("currentArrows")}>
        {t("simCurrent")}
      </Button>
      <Button type="button" size="sm" variant={toggles.formula ? "primary" : "secondary"} onClick={() => onToggle("formula")}>
        {t("simFormula")}
      </Button>
    </div>
  );
}
