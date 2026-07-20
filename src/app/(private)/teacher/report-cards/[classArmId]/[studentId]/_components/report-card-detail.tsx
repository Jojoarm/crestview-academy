'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  usePublishReportCard,
  useReportCard,
  useSaveRemark,
  useUnpublishReportCard,
} from '@/hooks/teacher/use-report-card';
import { GRADE_COLORS } from '@/types/teacher/score';
import { useTeacherSessions } from '@/hooks/teacher/use-teacher-session';

interface ReportCardDetailProps {
  classArmId: string;
  studentId: string;
  /** Carried over from the roster page's session picker, if the teacher
   * navigated here from a non-active session — avoids bouncing back to
   * "now" on load. */
  initialSessionId?: string;
}

export function ReportCardDetail({
  classArmId,
  studentId,
  initialSessionId,
}: ReportCardDetailProps) {
  const router = useRouter();

  const { data: sessions, isLoading: sessionsLoading } = useTeacherSessions();

  const [sessionId, setSessionId] = useState('');
  const [termId, setTermId] = useState('');
  const [remarkDraft, setRemarkDraft] = useState('');
  const [confirmAction, setConfirmAction] = useState<
    'publish' | 'unpublish' | null
  >(null);

  // Default to whatever session we arrived with (from the roster page's
  // picker), falling back to the active session if none was passed or it
  // doesn't match a real session. Term defaults to that session's active
  // term, or its first term for a past session.
  useEffect(() => {
    if (!sessions || sessions.length === 0 || sessionId) return;
    const target =
      (initialSessionId && sessions.find((s) => s.id === initialSessionId)) ||
      sessions.find((s) => s.isActive) ||
      sessions[0];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId(target.id);
    const targetTerm = target.terms.find((t) => t.isActive) ?? target.terms[0];
    setTermId(targetTerm?.id ?? '');
  }, [sessions, initialSessionId, sessionId]);

  const selectedSession = sessions?.find((s) => s.id === sessionId);

  function handleSessionChange(newSessionId: string) {
    setSessionId(newSessionId);
    const session = sessions?.find((s) => s.id === newSessionId);
    // Only the currently active session has a term flagged isActive — past
    // sessions don't have a "current" term, so default to the first one.
    const nextTerm =
      session?.terms.find((t) => t.isActive) ?? session?.terms[0];
    setTermId(nextTerm?.id ?? '');
  }

  const {
    data: reportCard,
    isLoading: reportCardLoading,
    error: reportCardError,
  } = useReportCard(classArmId, studentId, { sessionId, termId });

  const saveRemark = useSaveRemark(classArmId, studentId);
  const publishReportCard = usePublishReportCard(classArmId, studentId);
  const unpublishReportCard = useUnpublishReportCard(classArmId, studentId);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemarkDraft(reportCard?.remark ?? '');
  }, [reportCard]);

  const isPublished = reportCard?.status === 'Published';
  const remarkChanged = remarkDraft.trim() !== (reportCard?.remark ?? '');

  async function handleSaveRemark() {
    if (!remarkDraft.trim()) {
      toast.error('Write a remark before saving');
      return;
    }
    try {
      await saveRemark.mutateAsync({
        remark: remarkDraft.trim(),
        sessionId,
        termId,
      });
      toast.success('Remark saved');
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to save remark',
      );
    }
  }

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

  const isActing = publishReportCard.isPending || unpublishReportCard.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/teacher/report-cards')}
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

      {/* Session/term picker */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={sessionId}
            onValueChange={handleSessionChange}
            disabled={sessionsLoading}
          >
            <SelectTrigger className="w-40 h-9 border-border font-body text-sm">
              <SelectValue placeholder="Session" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              {sessions?.map((s) => (
                <SelectItem key={s.id} value={s.id} className="font-body">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={termId}
            onValueChange={setTermId}
            disabled={!selectedSession}
          >
            <SelectTrigger className="w-36 h-9 border-border font-body text-sm">
              <SelectValue placeholder="Term" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              {selectedSession?.terms.map((t) => (
                <SelectItem key={t.id} value={t.id} className="font-body">
                  {t.name} Term
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {reportCardError ? (
        <Card className="p-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            {reportCardError instanceof ApiError
              ? reportCardError.message
              : 'Could not load this report card.'}
          </p>
        </Card>
      ) : reportCardLoading || !reportCard ? (
        <div className="space-y-4">
          <div className="h-32 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-48 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      ) : (
        <>
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
            <p className="font-body text-xs text-muted-foreground mt-3">
              Scores are managed from Student Grading, corrections there reflect
              here immediately, even after this report card is published.
            </p>
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

          {/* Remark */}
          <Card className="p-4">
            <h2 className="font-sans font-semibold text-lg text-foreground mb-3">
              Remark
            </h2>
            <Textarea
              value={remarkDraft}
              onChange={(e) => setRemarkDraft(e.target.value)}
              disabled={isPublished}
              rows={4}
              maxLength={1000}
              placeholder="Write a comment on this student's term..."
              className="border-border font-body text-sm"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="font-body text-xs text-muted-foreground">
                {isPublished
                  ? 'Unpublish to edit the remark.'
                  : `${remarkDraft.length}/1000`}
              </p>
              {!isPublished && (
                <Button
                  onClick={handleSaveRemark}
                  disabled={saveRemark.isPending || !remarkChanged}
                  className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body"
                >
                  {saveRemark.isPending ? 'Saving...' : 'Save Remark'}
                </Button>
              )}
            </div>
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
                disabled={isActing || !reportCard.remark}
                className="bg-primary hover:bg-accent text-primary-foreground font-body"
              >
                Publish Report Card
              </Button>
            )}
          </div>
        </>
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
                ? 'This locks the remark from further edits. Scores and attendance can still be corrected separately and will keep reflecting here even after publishing.'
                : 'This reverts the report card to Draft and re-enables the remark for editing.'}
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
