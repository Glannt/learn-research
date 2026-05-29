"use client";

import { Maximize2, X, Sliders, BookOpen, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { SimulationParameter } from "@/types";
import { ParameterSlider } from "@/components/simulation/parameter-slider";

export function ZoomableVisual({
  title,
  children,
  className,
  parameters,
  setParameters,
  parameterDefs,
  instructions,
  safetyNote,
  subject,
  customSidebarContent,
  customSidebarTitle
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  parameters?: Record<string, number>;
  setParameters?: (key: string, value: number) => void;
  parameterDefs?: SimulationParameter[];
  instructions?: string[] | React.ReactNode;
  safetyNote?: string;
  subject?: string;
  customSidebarContent?: React.ReactNode;
  customSidebarTitle?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<"parameters" | "guide" | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        setActiveSidebar(null);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = expanded ? "hidden" : "";
    window.setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [expanded]);

  const activeParams = parameterDefs?.filter((p) => p.max > p.min) ?? [];

  return (
    <div
      className={cn(
        "relative",
        expanded && "fixed inset-0 z-50 flex flex-col bg-slate-950 p-6 text-slate-100 backdrop-blur-md overflow-hidden",
        className
      )}
    >
      {/* Standard trigger (when collapsed) */}
      {!expanded && (
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setExpanded(true)}
            aria-label={t("expandVisual")}
            title={t("expandVisual")}
            className="bg-slate-900/80 hover:bg-slate-800 text-slate-100 border border-slate-700 backdrop-blur-md transition-all shadow-md"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Full-screen zoomed view header */}
      {expanded && (
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {subject && (
                <span className="rounded bg-sky-950 px-2.5 py-0.5 text-xs font-semibold text-sky-400 border border-sky-800/60 uppercase">
                  {subject === "physics" ? t("subjectPhysics") : t("subjectChemistry")}
                </span>
              )}
              <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
            </div>
            <p className="text-xs text-slate-400">{t("fullscreenHint")}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Parameter Flow Button */}
            {((parameters && setParameters && activeParams.length > 0) || customSidebarContent) && (
              <Button
                variant={activeSidebar === "parameters" ? "primary" : "secondary"}
                onClick={() => setActiveSidebar(activeSidebar === "parameters" ? null : "parameters")}
                className={cn(
                  "flex items-center gap-2 transition-all font-medium text-sm px-4 py-2 border",
                  activeSidebar === "parameters" 
                    ? "bg-sky-600 hover:bg-sky-700 text-white border-transparent"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700"
                )}
              >
                <Sliders className="h-4.5 w-4.5" />
                {customSidebarTitle || t("zoomParameterFlow")}
              </Button>
            )}

            {/* Guide Flow Button */}
            {(instructions || safetyNote) && (
              <Button
                variant={activeSidebar === "guide" ? "primary" : "secondary"}
                onClick={() => setActiveSidebar(activeSidebar === "guide" ? null : "guide")}
                className={cn(
                  "flex items-center gap-2 transition-all font-medium text-sm px-4 py-2 border",
                  activeSidebar === "guide"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700"
                )}
              >
                <BookOpen className="h-4.5 w-4.5" />
                {t("zoomGuideFlow")}
              </Button>
            )}

            {/* Minimize / Close button */}
            <Button
              variant="danger"
              onClick={() => {
                setExpanded(false);
                setActiveSidebar(null);
              }}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm px-4 py-2 transition-all shadow-lg"
            >
              <X className="h-4.5 w-4.5" />
              {t("zoomMinimize")}
            </Button>
          </div>
        </header>
      )}

      {/* Main Workspace Area (split when sidebar is open) */}
      <div className={cn("min-w-0 flex-1 flex relative", expanded && "w-full overflow-y-auto")}>
        {/* Simulation visual container */}
        <div className={cn(
          "w-full transition-all duration-300 flex items-center justify-center overflow-auto",
          expanded && activeSidebar && "pr-[380px]"
        )}>
          <div className={cn(
            "w-full rounded-xl shadow-2xl border border-transparent bg-slate-950",
            expanded && "min-w-[760px] max-w-[90vw] p-2 border-slate-800/80"
          )}>
            {children}
          </div>
        </div>

        {/* Sliding Sidebars (Sliding from the right within the zoomed frame) */}
        {expanded && (
          <>
            {/* Parameter Sidebar */}
            <aside
              className={cn(
                "fixed top-[88px] right-0 bottom-0 w-[360px] bg-slate-900/95 border-l border-slate-800 p-6 flex flex-col space-y-6 shadow-2xl z-40 transition-transform duration-300 ease-in-out backdrop-blur-md overflow-y-auto",
                activeSidebar === "parameters" ? "translate-x-0" : "translate-x-full"
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sky-400">
                  <Sliders className="h-5 w-5" />
                  <h3 className="font-bold text-base text-white">{customSidebarTitle || t("zoomParamsTitle")}</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setActiveSidebar(null)} className="h-8 w-8 text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-5">
                {customSidebarContent ? (
                  customSidebarContent
                ) : parameters && setParameters && activeParams.length > 0 ? (
                  activeParams.map((parameter) => (
                    <div key={parameter.key} className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                      <ParameterSlider
                        parameter={parameter}
                        value={parameters[parameter.key] ?? parameter.defaultValue}
                        onChange={(value) => setParameters(parameter.key, value)}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">{t("chooseSampleControls")}</p>
                )}
              </div>
            </aside>

            {/* Guide Sidebar */}
            <aside
              className={cn(
                "fixed top-[88px] right-0 bottom-0 w-[360px] bg-slate-900/95 border-l border-slate-800 p-6 flex flex-col space-y-6 shadow-2xl z-40 transition-transform duration-300 ease-in-out backdrop-blur-md overflow-y-auto",
                activeSidebar === "guide" ? "translate-x-0" : "translate-x-full"
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <BookOpen className="h-5 w-5" />
                  <h3 className="font-bold text-base text-white">{t("zoomGuideTitle")}</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setActiveSidebar(null)} className="h-8 w-8 text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-6">
                {/* Guidelines List */}
                {instructions && (
                  <div className="space-y-3">
                    {Array.isArray(instructions) ? (
                      <ol className="space-y-3">
                        {instructions.map((step, idx) => (
                          <li key={idx} className="flex gap-3 items-start text-sm text-slate-300 rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-[11px] font-bold text-emerald-400 border border-emerald-800/50">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800">
                        {instructions}
                      </div>
                    )}
                  </div>
                )}

                {/* Safety Note */}
                {safetyNote && (
                  <div className="rounded-lg border border-amber-800/60 bg-amber-950/30 p-4 text-sm text-amber-200 flex gap-3 items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-300 mb-1">{t("zoomSafetyTitle")}</h4>
                      <p className="leading-relaxed text-xs text-amber-200/90">{safetyNote}</p>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
