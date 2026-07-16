'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  useAssignment,
  useAssignmentSubmissions,
  useDeleteAssignment,
} from '@/hooks/teacher/use-assignments';
import type { Submission } from '@/types/teacher/assignment';
import { AssignmentFormSheet } from '../_components/assignment-form-sheet';
import { ConfirmDeleteDialog } from '@/app/(private)/admin/users/_components/ConfirmDeleteDialog';
import { GradeSubmissionDialog } from '../_components/grade-submission-dialog';
import { formatClassArmLabel } from '@/lib/utils';

export default function AssignmentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const assignmentId = params.id;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(
    null,
  );

  const { data: assignment, isLoading } = useAssignment(assignmentId);
  const { data: submissions, isLoading: submissionsLoading } =
    useAssignmentSubmissions(assignmentId);
  const deleteAssignment = useDeleteAssignment();

  async function confirmDelete() {
    await deleteAssignment.mutateAsync(assignmentId);
    router.push('/teacher/assignments');
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="h-40 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-sm text-muted-foreground">Assignment not found.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/teacher/assignments')}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl text-foreground">
              {assignment.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatClassArmLabel(assignment.classArm)} &middot;{' '}
              {assignment.subject.name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="size-4 text-destructive" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={assignment.isPublished ? 'default' : 'secondary'}
            className={
              assignment.isPublished
                ? 'bg-terracotta-pale text-primary hover:bg-terracotta-pale'
                : ''
            }
          >
            {assignment.isPublished ? 'Published' : 'Draft'}
          </Badge>
          <Badge variant="outline">
            {assignment.type === 'Typed' ? 'Typed response' : 'File upload'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {assignment.session.name} &middot; {assignment.term.name} Term
          </span>
        </div>

        {assignment.description && (
          <p className="text-sm text-foreground">{assignment.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Due date
            </p>
            <p className="font-medium text-foreground">
              {new Date(assignment.dueDate).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Submissions
            </p>
            <p className="font-medium text-foreground">
              {assignment._count.submissions}
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="font-heading text-lg text-foreground">Submissions</h2>

        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Graded by</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissionsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : !submissions || submissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No submissions yet — students will be able to submit once
                    the student portal is live.
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium text-foreground">
                      {submission.student.user.name}
                    </TableCell>
                    <TableCell>
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {submission.score !== null ? (
                        parseFloat(submission.score)
                      ) : (
                        <span className="text-muted-foreground">
                          Not graded
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {submission.gradedBy?.user.name ?? '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGradingSubmission(submission)}
                      >
                        {submission.score !== null ? 'Update grade' : 'Grade'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AssignmentFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        assignment={assignment}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        entity="assignment"
        name={assignment.title}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        isPending={deleteAssignment.isPending}
      />

      <GradeSubmissionDialog
        open={!!gradingSubmission}
        onOpenChange={(open) => !open && setGradingSubmission(null)}
        assignmentId={assignmentId}
        submission={gradingSubmission}
      />
    </div>
  );
}
