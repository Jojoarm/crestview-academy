'use client';

import {
  Users,
  GraduationCap,
  HeartHandshake,
  BookUser,
  ShieldCheck,
} from 'lucide-react';
import { useUserStats } from '@/hooks/admin/use-users';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

// Types

type RoleKey = 'teachers' | 'admins' | 'parents' | 'students';

type RoleConfig = {
  label: string;
  key: RoleKey;
  icon: LucideIcon;
  textColor: string;
  bgColor: string;
  barColor: string;
};

// Config

const roles: RoleConfig[] = [
  {
    label: 'Teachers',
    key: 'teachers',
    icon: GraduationCap,
    textColor: '#403C5C',
    bgColor: '#F5F3FA',
    barColor: '#635B8C',
  },
  {
    label: 'Admins',
    key: 'admins',
    icon: ShieldCheck,
    textColor: '#C66A42',
    bgColor: '#FEF4EE',
    barColor: '#D97745',
  },
  {
    label: 'Parents',
    key: 'parents',
    icon: HeartHandshake,
    textColor: '#5F6257',
    bgColor: '#F5F7F2',
    barColor: '#7A806C',
  },
  {
    label: 'Students',
    key: 'students',
    icon: BookUser,
    textColor: '#8B8F7E',
    bgColor: '#FAFAF7',
    barColor: '#B2B6A5',
  },
];

// Sub-components

function FillBar({
  percentage,
  color,
  delay = 0,
}: {
  percentage: number;
  color: string;
  delay?: number;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(percentage), 150 + delay);
    return () => clearTimeout(t);
  }, [percentage, delay]);

  return (
    <div className="h-0.75 w-full rounded-full bg-black/6 overflow-hidden">
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

function CompositionBar({
  data,
  total,
}: {
  data: Record<string, number> | undefined;
  total: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-3">
      {/* Segmented strip */}
      <div className="flex h-2 w-full rounded-full overflow-hidden gap-px bg-black/4">
        {roles.map((r, i) => {
          const val = data?.[r.key] ?? 0;
          const pct = total > 0 ? (val / total) * 100 : 0;
          return (
            <div
              key={r.key}
              className="h-full transition-[width] duration-700 ease-out"
              style={{
                width: mounted ? `${pct}%` : '0%',
                backgroundColor: r.barColor,
                transitionDelay: `${i * 80}ms`,
                // Only round the outer ends
                borderRadius:
                  i === 0
                    ? '999px 0 0 999px'
                    : i === roles.length - 1
                      ? '0 999px 999px 0'
                      : '0',
              }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {roles.map((r) => {
          const val = data?.[r.key] ?? 0;
          const pct = total > 0 ? Math.round((val / total) * 100) : 0;
          return (
            <div key={r.key} className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: r.barColor }}
              />
              <span className="text-[11px] font-body text-(--charcoal-100) leading-none">
                {r.label}
              </span>
              <span className="text-[11px] font-mono font-semibold text-(--charcoal) leading-none tabular-nums">
                {val.toLocaleString()}
                <span className="text-(--charcoal-100) font-normal ml-0.5">
                  ({pct}%)
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded bg-(--warm-white-dark) animate-pulse', className)}
    />
  );
}

// Main Component

export function UserStats() {
  const { data, isLoading } = useUserStats();
  const total = data?.total ?? 0;

  const getPct = (val: number) =>
    total > 0 ? Math.round((val / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Hero: Total Users */}
      <Card className="col-span-2 lg:col-span-4 p-6 flex flex-col gap-5 relative overflow-hidden">
        {/* Ambient accent — soft glow behind the icon */}
        <div
          className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-[0.08] blur-3xl"
          style={{ backgroundColor: 'var(--terracotta)' }}
        />

        {/* Top row: icon + label + number */}
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-terracotta-pale text-terracotta image-border shrink-0 mt-0.5">
            <Users className="size-5" />
          </div>
          <div>
            <p className="font-body text-xs text-(--charcoal) uppercase font-medium tracking-widest leading-none mb-1.5">
              Total Users
            </p>
            {isLoading ? (
              <Skeleton className="h-9 w-28" />
            ) : (
              <p className="font-accent font-bold text-4xl text-(--charcoal) leading-none tabular-nums">
                {total.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Composition strip */}
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : total > 0 ? (
          <CompositionBar data={data as Record<string, number>} total={total} />
        ) : null}
      </Card>

      {/* Role Cards */}
      {roles.map(
        ({ label, key, icon: Icon, textColor, bgColor, barColor }, i) => {
          const value = data?.[key] ?? 0;
          const pct = getPct(value);

          return (
            <Card
              key={key}
              className="col-span-1 p-5 flex flex-col gap-3.5 relative overflow-hidden group"
            >
              {/* Hover glow — each card gets its own role color */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at top right, ${barColor}12, transparent 65%)`,
                }}
              />

              {/* Icon + percentage */}
              <div className="relative flex items-center justify-between">
                <div
                  className="p-2 rounded-xl image-border"
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                  }}
                >
                  <Icon className="size-4" />
                </div>
                {!isLoading && total > 0 && (
                  <span
                    className="text-xs font-mono font-semibold tabular-nums"
                    style={{ color: textColor }}
                  >
                    {pct}%
                  </span>
                )}
              </div>

              {/* Label + count */}
              <div className="relative">
                <p className="font-body text-xs text-(--charcoal) uppercase font-medium tracking-wide leading-none mb-1">
                  {label}
                </p>
                {isLoading ? (
                  <Skeleton className="h-7 w-14" />
                ) : (
                  <p className="font-accent font-bold text-2xl text-(--charcoal) leading-none tabular-nums">
                    {value.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Animated proportion bar */}
              {!isLoading && (
                <FillBar percentage={pct} color={barColor} delay={i * 100} />
              )}
            </Card>
          );
        },
      )}
    </div>
  );
}
