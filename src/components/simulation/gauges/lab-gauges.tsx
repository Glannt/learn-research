"use client";

import { Gauge, Thermometer, Waves } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";
import { formatNumber } from "@/lib/utils";

function GaugeCard({ icon, label, value, unit, tone = "blue" }: { icon: React.ReactNode; label: string; value: number; unit: string; tone?: "blue" | "orange" | "green" }) {
  const colors = {
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    green: "bg-emerald-500"
  };
  const normalized = Math.max(0, Math.min(100, Math.abs(value)));
  return (
    <div className="rounded-md border border-border p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">{icon}{label}</span>
        <span>{formatNumber(value, 2)} {unit}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div className={`h-full rounded-full ${colors[tone]}`} style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}

export function SpeedometerGauge({ value }: { value: number }) {
  const { t } = useI18n();
  return <GaugeCard icon={<Gauge className="h-3.5 w-3.5" />} label={t("simSpeed")} value={value} unit="m/s" tone="blue" />;
}

export function PressureGauge({ value }: { value: number }) {
  const { t } = useI18n();
  return <GaugeCard icon={<Waves className="h-3.5 w-3.5" />} label={t("simPressure")} value={value / 1000} unit="kPa" tone="green" />;
}

export function TemperatureGauge({ value }: { value: number }) {
  const { t } = useI18n();
  return <GaugeCard icon={<Thermometer className="h-3.5 w-3.5" />} label={t("simTemperature")} value={value} unit="K" tone="orange" />;
}
