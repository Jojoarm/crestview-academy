'use client';

import { Layers, BookOpen, UserCheck, Banknote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { DashboardStats } from '@/hooks/admin/use-analytics';

type Props = {
  stats?: DashboardStats;
  isLoading: boolean;
};

function OverviewCard({
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
    <Card className="p-4 flex flex-row gap-3 items-center">
      <div className={`p-2 rounded-lg shrink-0 image-border ${iconClass}`}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="font-body text-xs text-muted-foreground font-medium truncate">
          {label}
        </p>
        {isLoading ? (
          <div className="h-5 w-10 bg-muted animate-pulse rounded mt-0.5" />
        ) : (
          <p className="font-sans font-bold text-lg text-foreground tabular-nums leading-tight">
            {value.toLocaleString()}
          </p>
        )}
        {sub && !isLoading && (
          <p className="font-body text-xs text-muted-foreground">{sub}</p>
        )}
      </div>
    </Card>
  );
}

export function SchoolOverviewCards({ stats, isLoading }: Props) {
  const items = [
    {
      label: 'Active Classes',
      value: stats?.classes.total ?? 0,
      sub: `${stats?.classes.totalArms ?? 0} arms`,
      icon: Layers,
      iconClass: 'bg-light-violet text-violet',
    },
    {
      label: 'Active Subjects',
      value: stats?.subjects.total ?? 0,
      sub: `${stats?.subjects.totalAssignments ?? 0} assignments`,
      icon: BookOpen,
      iconClass: 'bg-sage-light/20 text-sage',
    },
    {
      label: 'Class Teacher Assignments',
      value: stats?.teachers.classAssignments ?? 0,
      icon: UserCheck,
      iconClass: 'bg-ring text-primary',
    },
    {
      label: 'Subject Teacher Assignments',
      value: stats?.teachers.subjectAssignments ?? 0,
      icon: UserCheck,
      iconClass: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Active Fee Structures',
      value: stats?.fees.activeStructures ?? 0,
      icon: Banknote,
      iconClass: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <OverviewCard key={item.label} {...item} isLoading={isLoading} />
      ))}
    </div>
  );
}
