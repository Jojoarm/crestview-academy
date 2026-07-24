import { useRouter } from 'next/navigation';
import { ClipboardList } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { formatDate } from '@/lib/utils';
import type {
  AssignmentDueSoon,
  ChildDashboardSummary,
} from '@/types/parent/dashboard';

interface AssignmentsDueSectionProps {
  assignments: AssignmentDueSoon[];
  childrenList: ChildDashboardSummary[];
}

export function AssignmentsDueSection({
  assignments,
  childrenList,
}: AssignmentsDueSectionProps) {
  const router = useRouter();
  const nameByStudentId = new Map(
    childrenList.map((c) => [c.studentId, c.name]),
  );

  return (
    <Card className="p-4">
      <h2 className="font-sans font-semibold text-lg text-foreground mb-3">
        Due This Week
      </h2>

      {assignments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nothing due soon"
          description="No assignments are due in the next 7 days."
        />
      ) : (
        <div className="space-y-2">
          {assignments.map((assignment) => (
            <button
              key={`${assignment.assignmentId}-${assignment.studentId}`}
              type="button"
              onClick={() =>
                router.push(
                  `/parent/children/${assignment.studentId}/assignments`,
                )
              }
              className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-body text-sm font-medium text-foreground truncate">
                  {assignment.title}
                </p>
                <p className="font-body text-xs text-muted-foreground truncate">
                  {assignment.subject} &middot;{' '}
                  {nameByStudentId.get(assignment.studentId) ?? 'Child'}
                </p>
              </div>
              <span className="font-body text-xs text-primary font-medium shrink-0">
                {formatDate(assignment.dueDate)}
              </span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
