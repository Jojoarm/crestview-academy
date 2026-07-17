'use client';

import {
  GraduationCap,
  UserCheck,
  HeartHandshake,
  BookUser,
} from 'lucide-react';
import type { DashboardStats } from '@/hooks/admin/use-analytics';
import { MetricCard } from '@/components/MetricCard';

type Props = {
  stats?: DashboardStats;
  isLoading: boolean;
};

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
