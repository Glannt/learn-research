import { Box, PanelsTopLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export type VisualViewMode = "2d" | "3d";

export function TwoDThreeDToggle({ value, onChange }: { value: VisualViewMode; onChange: (value: VisualViewMode) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-card p-1">
      <Button type="button" size="sm" variant={value === "2d" ? "primary" : "ghost"} onClick={() => onChange("2d")}>
        <PanelsTopLeft className="h-4 w-4" />
        2D
      </Button>
      <Button type="button" size="sm" variant={value === "3d" ? "primary" : "ghost"} onClick={() => onChange("3d")}>
        <Box className="h-4 w-4" />
        3D
      </Button>
    </div>
  );
}
