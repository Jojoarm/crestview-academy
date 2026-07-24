import { Card } from '@/components/ui/card';
import { cn, formatDate, getDueStatus } from '@/lib/utils';
import { type AssignmentSummary } from '@/types/parent/assignment';

export function AssignmentCard({
  assignment,
}: {
  assignment: AssignmentSummary;
}) {
  const dueStatus = getDueStatus(assignment.dueDate);

  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {assignment.subject.name}
          </p>
          <h3 className="font-sans font-semibold text-base text-deep-violet truncate">
            {assignment.title}
          </h3>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium shrink-0',
            dueStatus.className,
          )}
        >
          {dueStatus.label}
        </span>
      </div>

      {assignment.description && (
        <p className="font-body text-sm text-muted-foreground line-clamp-2">
          {assignment.description}
        </p>
      )}

      <div className="flex items-center justify-end pt-1">
        <span className="font-body text-xs text-muted-foreground">
          Due {formatDate(assignment.dueDate)}
        </span>
      </div>
    </Card>
  );
}
