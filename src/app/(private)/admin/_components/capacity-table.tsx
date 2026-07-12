'use client';

import { useState } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { SECTIONS, type Section } from '@/types/class';
import type { CapacityOverview } from '@/hooks/admin/use-analytics';

type Props = {
  overview: CapacityOverview[];
  isLoading: boolean;
};

const chartConfig = {
  enrolled: {
    label: 'Enrolled',
    color: 'var(--color-primary)',
  },
  available: {
    label: 'Available',
    color: 'var(--color-terracotta-pale)',
  },
} satisfies ChartConfig;

function percentColor(pct: number) {
  if (pct > 90) return 'text-red-600';
  if (pct >= 70) return 'text-amber-600';
  return 'text-emerald-600';
}

export function CapacityTable({ overview, isLoading }: Props) {
  const [section, setSection] = useState<Section | ''>('');

  const filtered = section
    ? overview.filter((o) => o.section === section)
    : overview;

  const chartData = filtered.map((o) => ({
    name: o.name,
    enrolled: o.enrolled,
    available: Math.max(o.available, 0),
    capacity: o.capacity,
    percentFull: Math.min(o.percentFull, 100),
  }));

  const avgFill =
    filtered.length > 0
      ? Math.round(
          filtered.reduce((a, b) => a + Math.min(b.percentFull, 100), 0) /
            filtered.length,
        )
      : 0;

  const mostFull = filtered.reduce(
    (max, o) => (o.percentFull > (max?.percentFull ?? -1) ? o : max),
    null as CapacityOverview | null,
  );

  return (
    <Card className="p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-sans font-semibold text-lg text-foreground">
            Capacity Overview
          </h2>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            Enrolled vs available seats per class arm
          </p>
        </div>

        {/* Section filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSection('')}
            className={cn(
              'px-3 py-1.5 rounded text-xs font-body font-medium transition-colors',
              section === ''
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-background-100',
            )}
          >
            All
          </button>
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-body font-medium transition-colors',
                section === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-background-100',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Summary pills */}
      {!isLoading && filtered.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded border border-border">
            <span className="font-body text-xs text-muted-foreground">
              Avg fill rate
            </span>
            <span
              className={cn(
                'font-body text-xs font-semibold',
                percentColor(avgFill),
              )}
            >
              {avgFill}%
            </span>
          </div>
          {mostFull && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded border border-border">
              <span className="font-body text-xs text-muted-foreground">
                Highest filled
              </span>
              <span
                className={cn(
                  'font-body text-xs font-semibold',
                  percentColor(mostFull.percentFull),
                )}
              >
                {mostFull.name} · {Math.min(mostFull.percentFull, 100)}%
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-sm bg-primary" />
              <span className="font-body text-xs text-muted-foreground">
                Enrolled
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-sm bg-terracotta-pale border border-border" />
              <span className="font-body text-xs text-muted-foreground">
                Available
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {isLoading ? (
        <div className="h-94 bg-muted animate-pulse rounded" />
      ) : filtered.length === 0 ? (
        <div className="h-94 flex items-center justify-center">
          <p className="font-body text-sm text-muted-foreground">
            No class arms set up yet.
          </p>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-94 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
            barCategoryGap="30%"
            barGap={2}
          >
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontFamily: 'var(--font-body)',
                fontSize: 6,
                fill: 'var(--color-muted-foreground)',
              }}
              interval={0}
              angle={filtered.length > 8 ? -35 : 0}
              textAnchor={filtered.length > 8 ? 'end' : 'middle'}
              height={filtered.length > 8 ? 50 : 30}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                fill: 'var(--color-muted-foreground)',
              }}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--color-muted)', opacity: 0.5 }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name, item) => {
                    const pct = item.payload?.percentFull;
                    if (name === 'enrolled') {
                      return (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-body text-xs font-medium">
                            {value} enrolled
                          </span>
                          <span
                            className={cn(
                              'font-body text-xs',
                              percentColor(pct),
                            )}
                          >
                            {pct}% full
                          </span>
                        </div>
                      );
                    }
                    return (
                      <span className="font-body text-xs">
                        {value} available
                      </span>
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey="enrolled"
              fill="var(--color-enrolled)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="available"
              fill="var(--color-available)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
              stroke="var(--color-border)"
              strokeWidth={1}
            />
          </BarChart>
        </ChartContainer>
      )}
    </Card>
  );
}
