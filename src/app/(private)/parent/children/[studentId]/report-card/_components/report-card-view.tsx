'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileClock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { useChildReportCard } from '@/hooks/parent/use-parent-report-card';
import { GRADE_COLORS } from '@/types/parent/report-card';
import { EmptyState } from '@/components/EmptyState';
import { SessionTermPicker } from '@/components/SessionTermPicker';

interface ReportCardViewProps {
  studentId: string;
}

export function ReportCardView({ studentId }: ReportCardViewProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [termId, setTermId] = useState('');

  const {
    data: reportCard,
    isLoading,
    error,
  } = useChildReportCard(studentId, {
    sessionId: sessionId || undefined,
    termId: termId || undefined,
  });

  // Sync pickers to whatever the backend actually resolved.
  useEffect(() => {
    if (reportCard?.session && reportCard.session.id !== sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionId(reportCard.session.id);
    }
    if (reportCard?.term && reportCard.term.id !== termId) {
      setTermId(reportCard.term.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportCard?.session?.id, reportCard?.term?.id]);

  function handleSessionChange(newSessionId: string) {
    setSessionId(newSessionId);
    setTermId('');
  }

  const notPublished = error instanceof ApiError && error.statusCode === 404;
  const needsTermPick = error instanceof ApiError && error.statusCode === 400;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/parent/children/${studentId}`)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-sans font-semibold text-xl text-foreground truncate">
            Report Card
          </h1>
          {reportCard && (
            <p className="font-body text-xs text-muted-foreground">
              {reportCard.classArm.classLevel} {reportCard.classArm.arm}{' '}
              &middot; {reportCard.term.name} Term, {reportCard.session.name}
            </p>
          )}
        </div>
      </div>

      {/* Session/term picker */}
      <Card className="p-4">
        <SessionTermPicker
          sessionId={sessionId}
          termId={termId}
          onSessionChange={handleSessionChange}
          onTermChange={setTermId}
        />
      </Card>

      {notPublished && (
        <EmptyState
          icon={FileClock}
          title="Report card not yet available"
          description="This term's report card hasn't been published yet. Check back once
        it's ready."
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
        <>
          {/* Scores */}
          <Card className="p-4">
            <h2 className="font-sans font-semibold text-lg text-foreground mb-3">
              Scores
            </h2>
            {reportCard.scores.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">
                No scores recorded for this term.
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
                            'inline-flex items-center justify-center size-6 rounded text-xs font-body font-semibold image-border',
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

          {/* Remark */}
          <Card className="p-4">
            <h2 className="font-sans font-semibold text-lg text-foreground mb-3">
              Teacher&apos;s Remark
            </h2>
            <p className="font-body text-sm text-foreground whitespace-pre-wrap">
              {reportCard.remark || 'No remark added for this term.'}
            </p>
          </Card>
        </>
      )}
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
