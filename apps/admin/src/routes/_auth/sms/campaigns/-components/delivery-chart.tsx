"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface DeliveryChartProps {
  data: { t: string; sent: number; failed: number }[];
}

const chartConfig = {
  sent: { label: "Sent", color: "hsl(var(--chart-2))" },
  failed: { label: "Failed", color: "var(--destructive)" },
} satisfies ChartConfig;

function tick(t: string): string {
  const d = new Date(t);
  return Number.isNaN(d.getTime())
    ? t
    : d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

export function DeliveryChart({ data }: DeliveryChartProps) {
  if (data.length === 0) {
    return <p className="p-8 text-sm text-muted-foreground">No send activity yet.</p>;
  }
  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data.map((b) => ({ ...b, label: tick(b.t) }))}>
          <XAxis dataKey="label" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
          <Area
            type="monotone"
            dataKey="sent"
            fill="var(--color-sent)"
            stroke="var(--color-sent)"
            fillOpacity={0.25}
          />
          <Area
            type="monotone"
            dataKey="failed"
            fill="var(--color-failed)"
            stroke="var(--color-failed)"
            fillOpacity={0.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
