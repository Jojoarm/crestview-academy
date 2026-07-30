/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileX, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import {
  useAdminReportCard,
  usePublishReportCard,
  useUnpublishReportCard,
} from '@/hooks/admin/use-admin-report-card';
import { SessionTermPicker } from '@/components/SessionTermPicker';
import { GRADE_COLORS } from '@/types/report-card';
import { EmptyState } from '@/components/EmptyState';

interface ReportCardViewProps {
  studentId: string;
}

export function ReportCardView({ studentId }: ReportCardViewProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [termId, setTermId] = useState('');
  const [confirmAction, setConfirmAction] = useState<
    'publish' | 'unpublish' | null
  >(null);

  const {
    data: reportCard,
    isLoading,
    isFetching,
    error,
  } = useAdminReportCard(studentId, {
    sessionId: sessionId || undefined,
    termId: termId || undefined,
  });

  const publishReportCard = usePublishReportCard(studentId);
  const unpublishReportCard = useUnpublishReportCard(studentId);

  // Sync pickers to whatever the backend actually resolved.
  useEffect(() => {
    if (isFetching || !reportCard) return;
    if (!sessionId) setSessionId(reportCard.session.id);
    if (!termId) setTermId(reportCard.term.id);
  }, [reportCard, isFetching, sessionId, termId]);

  function handleSessionChange(newSessionId: string) {
    setSessionId(newSessionId);
    setTermId('');
  }

  const isPublished = reportCard?.status === 'Published';
  const hasRemark = !!reportCard?.remark;
  const isActing = publishReportCard.isPending || unpublishReportCard.isPending;

  async function handleConfirmedAction() {
    try {
      if (confirmAction === 'publish') {
        await publishReportCard.mutateAsync({ sessionId, termId });
        toast.success('Report card published');
      } else if (confirmAction === 'unpublish') {
        await unpublishReportCard.mutateAsync({ sessionId, termId });
        toast.success('Report card unpublished');
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Something went wrong',
      );
    } finally {
      setConfirmAction(null);
    }
  }

  const needsTermPick = error instanceof ApiError && error.statusCode === 400;
  const notEnrolled = error instanceof ApiError && error.statusCode === 404;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/admin/users/students/${studentId}`)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-sans font-semibold text-xl text-foreground truncate">
            {reportCard?.student.name ?? 'Report Card'}
          </h1>
          {reportCard && (
            <p className="font-body text-xs text-muted-foreground">
              {reportCard.student.admissionNumber} &middot;{' '}
              {reportCard.session.name} &middot; {reportCard.term.name} Term
            </p>
          )}
        </div>
        {isFetching && reportCard && (
          <Loader2 className="size-4 text-muted-foreground animate-spin shrink-0" />
        )}
        {reportCard && (
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
              isPublished
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {reportCard.status}
          </span>
        )}
      </div>

      <Card className="p-4">
        <SessionTermPicker
          sessionId={sessionId}
          termId={termId}
          onSessionChange={handleSessionChange}
          onTermChange={setTermId}
        />
      </Card>

      {notEnrolled && (
        <EmptyState
          icon={FileX}
          title="No report card available"
          description="This student wasn't enrolled in any class for the selected session, so there's no report card to show."
        />
      )}

      {needsTermPick && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Please select a term for this session to view the report card.
        </p>
      )}

      {isLoading && !reportCard && (
        <div className="space-y-4">
          <div className="h-32 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-48 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      )}

      {reportCard && (
        <div
          className={cn(
            'space-y-6 transition-opacity',
            isFetching && 'opacity-50 pointer-events-none',
          )}
        >
          {/* Scores */}
          <Card className="p-4">
            <h2 className="font-sans font-semibold text-lg text-foreground mb-3">
              Scores
            </h2>
            {reportCard.scores.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">
                No scores recorded for this term yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-transparent">
                    <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                      Subject
                    </TableHead>
                    <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                      CA
                    </TableHead>
                    <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                      Exam
                    </TableHead>
                    <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                      Total
                    </TableHead>
                    <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                      Grade
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportCard.scores.map((row) => (
                    <TableRow
                      key={row.subject.code}
                      className="border-border/20"
                    >
                      <TableCell className="font-body text-sm text-foreground">
                        {row.subject.name}
                      </TableCell>
                      <TableCell className="font-body text-sm text-foreground tabular-nums">
                        {parseFloat(row.caScore)}
                      </TableCell>
                      <TableCell className="font-body text-sm text-foreground tabular-nums">
                        {parseFloat(row.examScore)}
                      </TableCell>
                      <TableCell className="font-body text-sm font-medium text-foreground tabular-nums">
                        {parseFloat(row.total)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center justify-center size-6 rounded text-xs font-body font-semibold',
                            GRADE_COLORS[row.grade],
                          )}
                        >
                          {row.grade}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          {/* Attendance */}
          <Card className="p-4">
            <h2 className="font-sans font-semibold text-lg text-foreground mb-3">
              Attendance
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <AttendanceStat
                label="Present"
                value={reportCard.attendance.summary.Present}
              />
              <AttendanceStat
                label="Absent"
                value={reportCard.attendance.summary.Absent}
              />
              <AttendanceStat
                label="Late"
                value={reportCard.attendance.summary.Late}
              />
              <AttendanceStat
                label="Excused"
                value={reportCard.attendance.summary.Excused}
              />
              <AttendanceStat
                label="Days marked"
                value={reportCard.attendance.totalDaysMarked}
              />
            </div>
          </Card>

          {/* Remark — read only, admin never edits */}
          <Card className="p-4">
            <h2 className="font-sans font-semibold text-lg text-foreground mb-3">
              Teacher&apos;s Remark
            </h2>
            {hasRemark ? (
              <p className="font-body text-sm text-foreground whitespace-pre-wrap">
                {reportCard.remark}
              </p>
            ) : (
              <div className="space-y-1.5">
                <p className="font-body text-sm text-muted-foreground">
                  Not started, the class teacher hasn&apos;t written a remark
                  yet.
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  Need to reassign the class teacher? Manage this from the class
                  arm&apos;s teacher assignment.
                </p>
              </div>
            )}
          </Card>

          {/* Publish / Unpublish */}
          <div className="flex justify-end">
            {isPublished ? (
              <Button
                variant="outline"
                onClick={() => setConfirmAction('unpublish')}
                disabled={isActing}
              >
                Unpublish
              </Button>
            ) : (
              <Button
                onClick={() => setConfirmAction('publish')}
                disabled={isActing || !hasRemark}
                className="bg-primary hover:bg-accent text-primary-foreground font-body"
              >
                Publish Report Card
              </Button>
            )}
          </div>
        </div>
      )}

      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans font-semibold text-lg">
              {confirmAction === 'publish'
                ? 'Publish report card'
                : 'Unpublish report card'}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              {confirmAction === 'publish'
                ? 'This makes the report card visible to the parent. The remark is authored by the class teacher and cannot be edited here.'
                : 'This reverts the report card to Draft and hides it from the parent.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActing}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleConfirmedAction}
              disabled={isActing}
              className="bg-primary hover:bg-accent text-primary-foreground"
            >
              {isActing
                ? 'Please wait...'
                : confirmAction === 'publish'
                  ? 'Publish'
                  : 'Unpublish'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AttendanceStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
        {label}
      </p>
      <p className="font-body font-bold text-xl text-foreground tabular-nums">
        {value}
      </p>
    </div>
  );
}
