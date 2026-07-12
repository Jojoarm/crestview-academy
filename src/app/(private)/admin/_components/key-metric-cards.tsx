'use client';

import {
  GraduationCap,
  UserCheck,
  HeartHandshake,
  BookUser,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { DashboardStats } from '@/hooks/admin/use-analytics';

type Props = {
  stats?: DashboardStats;
  isLoading: boolean;
};

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  iconClass,
  isLoading,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ElementType;
  iconClass: string;
  isLoading: boolean;
}) {
  return (
    <Card className="p-5 flex flex-row gap-3.5 relative overflow-hidden group">
      <div
        className={`h-fit p-2 rounded-xl shadow-md image-border shrink-0 ${iconClass}`}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide leading-none">
          {label}
        </p>
        {isLoading ? (
          <div className="h-7 w-16 bg-muted animate-pulse rounded" />
        ) : (
          <p className="font-sans font-bold text-2xl text-deep-violet leading-none tabular-nums">
            {value.toLocaleString()}
          </p>
        )}
        {sub && !isLoading && (
          <p className="text-xs text-muted-foreground">{sub}</p>
        )}
      </div>
    </Card>
  );
}

export function KeyMetricCards({ stats, isLoading }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard
        label="Students"
        value={stats?.users.students.total ?? 0}
        sub={`${stats?.users.students.active ?? 0} active`}
        icon={BookUser}
        iconClass="bg-[#FAFAF7] text-[#8B8F7E]"
        isLoading={isLoading}
      />
      <MetricCard
        label="Teachers"
        value={stats?.users.teachers.total ?? 0}
        sub={`${stats?.users.teachers.active ?? 0} active`}
        icon={GraduationCap}
        iconClass="bg-[#F5F3FA] text-[#403C5C]"
        isLoading={isLoading}
      />
      <MetricCard
        label="Parents"
        value={stats?.users.parents ?? 0}
        icon={HeartHandshake}
        iconClass="bg-[#F5F7F2] text-[#5F6257]"
        isLoading={isLoading}
      />
      <MetricCard
        label="Enrolled This Session"
        value={stats?.enrollment.total ?? 0}
        sub={stats?.session?.name ?? '—'}
        icon={UserCheck}
        iconClass="bg-[#FEF4EE] text-[#C66A42]"
        isLoading={isLoading}
      />
    </div>
  );
}
