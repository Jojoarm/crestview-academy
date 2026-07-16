'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

import {
  ATTENDANCE_STATUS_COLORS,
  ATTENDANCE_STATUSES,
  cn,
  getInitials,
} from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { useClassArmStudents } from '@/hooks/teacher/use-class-arm-students';
import {
  useAttendance,
  useMarkAttendance,
} from '@/hooks/teacher/use-attendance';
import { AttendanceStatus } from '@/types/teacher/attendance';
import Image from 'next/image';

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

interface TakeAttendancePanelProps {
  classArmId: string;
}

export function TakeAttendancePanel({ classArmId }: TakeAttendancePanelProps) {
  const [date, setDate] = useState(todayInputValue());
  // No entry means "not yet marked" — nothing is pre-selected until the
  // teacher taps a status or it was already saved for this day.
  const [statuses, setStatuses] = useState<
    Partial<Record<string, AttendanceStatus>>
  >({});

  const {
    data: roster,
    isLoading: rosterLoading,
    error: rosterError,
  } = useClassArmStudents(classArmId);

  // Pull existing records for this day so re-opening "today" pre-fills what
  // was already marked, rather than starting from a blank slate every time.
  const { data: existing, isLoading: existingLoading } = useAttendance({
    classArmId,
    date,
    limit: 100,
  });

  const markAttendance = useMarkAttendance();

  useEffect(() => {
    if (!roster) return;
    const existingByStudent = new Map(
      (existing?.data ?? []).map((r) => [r.studentId, r.status]),
    );
    const next: Partial<Record<string, AttendanceStatus>> = {};
    roster.forEach((s) => {
      const previous = existingByStudent.get(s.studentId);
      if (previous) next[s.studentId] = previous;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatuses(next);
  }, [roster, existing]);

  const isLoading = rosterLoading || existingLoading;
  const markedCount = Object.values(statuses).filter(Boolean).length;
  const totalCount = roster?.length ?? 0;

  function setStatus(studentId: string, status: AttendanceStatus) {
    setStatuses((prev) => ({ ...prev, [studentId]: status }));
  }

  function markAllPresent() {
    if (!roster) return;
    setStatuses(
      Object.fromEntries(roster.map((s) => [s.studentId, 'Present' as const])),
    );
  }

  async function handleSubmit() {
    const records = Object.entries(statuses)
      .filter((entry): entry is [string, AttendanceStatus] => !!entry[1])
      .map(([studentId, status]) => ({ studentId, status }));

    if (records.length === 0) {
      toast.error('Mark at least one student before saving');
      return;
    }

    try {
      await markAttendance.mutateAsync({ classArmId, date, records });
      toast.success('Attendance saved');
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to save attendance',
      );
    }
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-border/30 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={date}
            max={todayInputValue()}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 w-40 border-border font-body text-sm"
          />
          <Button
            variant="outline"
            onClick={markAllPresent}
            disabled={isLoading}
            className="h-9 font-body text-sm"
          >
            Mark all Present
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {!isLoading && totalCount > 0 && (
            <span className="font-body text-xs text-muted-foreground">
              {markedCount} of {totalCount} marked
            </span>
          )}
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading || markAttendance.isPending || markedCount === 0
            }
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body"
          >
            {markAttendance.isPending ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {rosterError ? (
        <p className="font-body text-sm text-muted-foreground">
          {rosterError instanceof ApiError
            ? rosterError.message
            : 'Could not load the class roster.'}
        </p>
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : !roster || roster.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          No students enrolled in this class arm yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-150 space-y-1.5">
            {roster.map((student) => (
              <div
                key={student.studentId}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 bg-muted/30 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {student.photoUrl ? (
                    <Image
                      src={student.photoUrl}
                      alt={student.name}
                      className="size-8 rounded-full object-cover shrink-0"
                      fill
                    />
                  ) : (
                    <div className="size-8 rounded-full bg-deep-violet text-primary-foreground flex items-center justify-center text-xs font-body font-medium shrink-0">
                      {getInitials(student.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-body text-sm text-foreground truncate">
                      {student.name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground truncate">
                      {student.admissionNumber}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  {ATTENDANCE_STATUSES.map((status) => {
                    const active = statuses[student.studentId] === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatus(student.studentId, status)}
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-body font-medium border transition-colors',
                          active
                            ? cn(
                                ATTENDANCE_STATUS_COLORS[status],
                                'border-transparent',
                              )
                            : 'bg-transparent text-muted-foreground border-border hover:bg-muted',
                        )}
                      >
                        {active && <Check className="size-3" />}
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
