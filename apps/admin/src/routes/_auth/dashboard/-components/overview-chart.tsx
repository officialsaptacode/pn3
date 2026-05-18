"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewChartProps {
  data: {
    name: string;
    bookings: number;
    confirmed: number;
  }[];
}

const chartConfig = {
  bookings: {
    label: "Total Bookings",
    color: "hsl(var(--chart-1))",
  },
  confirmed: {
    label: "Confirmed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function OverviewChart({ data }: OverviewChartProps) {
  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
          <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="confirmed" fill="var(--color-confirmed)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
