/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/Pagination';
import { useChildAttendance } from '@/hooks/parent/use-parent-attendance';
import { AttendanceSummaryCards } from './attendance-summary-cards';
import { ATTENDANCE_STATUS_COLORS } from '@/types/parent/attendance';
import { ApiError } from '@/lib/api-client';
import { SessionTermPicker } from '@/components/SessionTermPicker';
import { EmptyState } from '@/components/EmptyState';
import { ArrowLeft, CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const LIMIT = 20;

export function AttendanceView({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [termId, setTermId] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useChildAttendance(studentId, {
    sessionId: sessionId || undefined,
    termId: termId || undefined,
    page,
    limit: LIMIT,
  });

  // Sync local picker state to whatever the backend actually resolved,
  // so the dropdowns reflect reality rather than an unconfirmed request.
  useEffect(() => {
    if (data?.session && data.session.id !== sessionId) {
      setSessionId(data.session.id);
    }
    if (data?.term && data.term.id !== termId) {
      setTermId(data.term.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.session?.id, data?.term?.id]);

  const handleSessionChange = (newSessionId: string) => {
    setSessionId(newSessionId);
    setTermId(''); // must repick term; backend will 400 if no active term and none supplied
    setPage(1);
  };

  const handleTermChange = (newTermId: string) => {
    setTermId(newTermId);
    setPage(1);
  };

  const notEnrolled = error instanceof ApiError && error.statusCode === 404;
  const needsTermPick = error instanceof ApiError && error.statusCode === 400;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/parent/children/${studentId}`)}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-sans font-semibold text-2xl text-foreground">
              Attendance
            </h1>
            {data && (
              <p className="text-sm text-muted-foreground">
                {data.term.name} Term | {data.session.name} Session
              </p>
            )}
          </div>
        </div>
        <SessionTermPicker
          sessionId={sessionId}
          termId={termId}
          onSessionChange={handleSessionChange}
          onTermChange={handleTermChange}
        />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {notEnrolled && (
        <EmptyState
          icon={CalendarX}
          title="No Attendance Records Available"
          description="This student wasn't enrolled in a class during the selected academic session, so there are no attendance records to display."
        />
      )}

      {needsTermPick && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Please select a term for this session to view attendance.
        </p>
      )}

      {data && (
        <>
          <AttendanceSummaryCards
            summary={data.summary}
            isLoading={isLoading}
          />

          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border/40 ">
                <tr>
                  <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-10 text-center font-body text-sm text-muted-foreground"
                    >
                      There are no attendance records available for the selected
                      session and term.
                    </td>
                  </tr>
                ) : (
                  data.data.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="px-4 py-3 text-foreground">
                        {new Date(record.date).toLocaleDateString('en-GB', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium image-border ${ATTENDANCE_STATUS_COLORS[record.status]}`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>

          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            total={data.meta.total}
            limit={data.meta.limit}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
