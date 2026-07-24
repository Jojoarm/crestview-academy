import { CheckCircle2, XCircle, Clock, FileCheck } from 'lucide-react';
import type { AttendanceSummary } from '@/types/parent/attendance';
import { MetricCard } from '@/components/MetricCard';

const STAT_CONFIG = [
  {
    key: 'Present' as const,
    label: 'Present',
    icon: CheckCircle2,
    iconClass: 'bg-emerald-50 text-emerald-600',
  },
  {
    key: 'Absent' as const,
    label: 'Absent',
    icon: XCircle,
    iconClass: 'bg-rose-50 text-rose-600',
  },
  {
    key: 'Late' as const,
    label: 'Late',
    icon: Clock,
    iconClass: 'bg-amber-50 text-amber-600',
  },
  {
    key: 'Excused' as const,
    label: 'Excused',
    icon: FileCheck,
    iconClass: 'bg-sky-50 text-sky-600',
  },
];

export function AttendanceSummaryCards({
  summary,
  isLoading,
}: {
  summary: AttendanceSummary;
  isLoading: boolean;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {STAT_CONFIG.map(({ key, label, icon: Icon, iconClass }) => (
        <MetricCard
          key={key}
          label={label}
          value={summary[key]}
          icon={Icon}
          iconClass={iconClass}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
