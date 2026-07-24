import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getInitials } from '@/lib/utils';
import { formatChildClass, RELATIONSHIP_COLORS } from '@/types/parent/child';
import type { ChildDashboardSummary } from '@/types/parent/dashboard';

const REPORT_CARD_LABEL = {
  Published: 'Report card ready',
  fallback: 'Report card not yet available',
};

export function ChildSummaryCard({ child }: { child: ChildDashboardSummary }) {
  const router = useRouter();
  const attendance = child.attendance;
  const totalMarked = attendance
    ? attendance.Present +
      attendance.Absent +
      attendance.Late +
      attendance.Excused
    : 0;

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/parent/children/${child.studentId}`)}
    >
      <div className="flex items-center gap-3 md:gap-1 lg:gap-3">
        <Avatar className="size-12 image-border shrink-0">
          <AvatarImage
            src={child.photoUrl ?? undefined}
            alt={child.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-deep-violet image-border text-primary-foreground text-sm font-body font-medium">
            {getInitials(child.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-row md:flex-col lg:flex-row items-center md:items-start lg:items-center gap-1.5">
            <p className="font-sans font-semibold text-sm text-foreground truncate">
              {child.name}
            </p>
            {child.isPrimary && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] lg:text-[10px] font-body font-medium bg-terracotta-pale text-primary shrink-0">
                Primary
              </span>
            )}
          </div>
          <p className="font-body text-xs text-muted-foreground">
            {formatChildClass(child.currentClass)}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium shrink-0',
            RELATIONSHIP_COLORS[child.relationship],
          )}
        >
          {child.relationship}
        </span>
        <ChevronRight className="size-4 text-muted-foreground shrink-0" />
      </div>

      <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
        {attendance ? (
          <p className="font-body text-xs text-muted-foreground">
            {totalMarked === 0
              ? 'No attendance marked yet this term'
              : `${attendance.Present} Present · ${attendance.Absent} Absent · ${attendance.Late} Late · ${attendance.Excused} Excused`}
          </p>
        ) : (
          <p className="font-body text-xs text-muted-foreground">
            No active term right now
          </p>
        )}

        <div className="flex items-center justify-between">
          <span
            className={cn(
              'font-body text-xs font-medium',
              child.reportCardStatus === 'Published'
                ? 'text-sage'
                : 'text-muted-foreground',
            )}
          >
            {child.reportCardStatus === 'Published'
              ? REPORT_CARD_LABEL.Published
              : REPORT_CARD_LABEL.fallback}
          </span>
        </div>
      </div>
    </Card>
  );
}
