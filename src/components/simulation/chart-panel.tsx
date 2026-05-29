"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export type ChartPoint = Record<string, number>;

export function ChartPanel({ data, lines }: { data: ChartPoint[]; lines: { key: string; color: string; name: string }[] }) {
  return (
    <div className="h-64 rounded-lg border border-border bg-card p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="t" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          {lines.map((line) => (
            <Line key={line.key} dot={false} type="monotone" dataKey={line.key} stroke={line.color} name={line.name} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
