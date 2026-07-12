'use client';

import { Card } from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';
import { useStudentEnrollments } from '@/hooks/admin/use-students';

type Props = { studentId: string };

export function EnrollmentHistory({ studentId }: Props) {
  const { data: enrollments, isLoading } = useStudentEnrollments(studentId);

  return (
    <Card className="p-5 flex flex-col gap-4">
      <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-terracotta-light">
        Enrollment History
      </h3>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : !enrollments || enrollments.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          No enrollment history yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {enrollments.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between gap-3 py-3 px-4 bg-muted border border-border rounded"
            >
              <div className="min-w-0">
                <p className="font-body text-sm font-medium text-foreground">
                  {e.classArm.classLevel.name} — Arm {e.classArm.arm.name}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {e.session.name} · Enrolled {formatDate(e.createdAt)}
                </p>
              </div>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium shrink-0',
                  e.isActive
                    ? 'bg-terracotta-pale text-primary'
                    : 'bg-muted-foreground/10 text-muted-foreground',
                )}
              >
                {e.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
