'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';

import { ApiError } from '@/lib/api-client';
import { useChildTimetable } from '@/hooks/parent/use-parent-timetable';
import { ChildTimetableGrid } from './child-timetable-grid';
import { SessionPicker } from '@/components/SessionPicker';

interface TimetableViewProps {
  studentId: string;
}

export function TimetableView({ studentId }: TimetableViewProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');

  const {
    data: timetable,
    isLoading,
    error,
  } = useChildTimetable(studentId, {
    sessionId: sessionId || undefined,
  });

  // Sync picker to whatever session the backend actually resolved.
  useEffect(() => {
    if (timetable?.session && timetable.session.id !== sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionId(timetable.session.id);
    }
  }, [sessionId, timetable?.session, timetable?.session.id]);

  const notEnrolled = error instanceof ApiError && error.statusCode === 404;

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
            Timetable
          </h1>
          {timetable && (
            <p className="font-body text-xs text-muted-foreground">
              {timetable.classArm.classLevel} {timetable.classArm.arm} &middot;{' '}
              {timetable.session.name}
            </p>
          )}
        </div>
      </div>

      <Card className="p-4">
        <SessionPicker sessionId={sessionId} onSessionChange={setSessionId} />
      </Card>

      {notEnrolled && (
        <EmptyState
          icon={CalendarDays}
          title="Not enrolled this session"
          description="This child wasn't enrolled in a class for the selected session, so there's no timetable to show."
        />
      )}

      {isLoading && !timetable && (
        <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
      )}

      {timetable && timetable.entries.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title="Nothing scheduled yet"
          description="No timetable entries have been set up for this class yet."
        />
      )}

      {timetable && timetable.entries.length > 0 && (
        <ChildTimetableGrid entries={timetable.entries} />
      )}
    </div>
  );
}
