'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ClipboardList } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/Pagination';

import { ApiError } from '@/lib/api-client';
import { useChildAssignments } from '@/hooks/parent/use-parent-assignments';
import { AssignmentCard } from './assignment-card';
import { SessionTermPicker } from '@/components/SessionTermPicker';

const LIMIT = 20;

interface AssignmentsViewProps {
  studentId: string;
}

export function AssignmentsView({ studentId }: AssignmentsViewProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [termId, setTermId] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useChildAssignments(studentId, {
    sessionId: sessionId || undefined,
    termId: termId || undefined,
    page,
    limit: LIMIT,
  });

  // Sync pickers to whatever session/term the backend actually resolved.
  useEffect(() => {
    if (data?.session && data.session.id !== sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionId(data.session.id);
    }
    if (data?.term && data.term.id !== termId) {
      setTermId(data.term.id);
    }
  }, [
    data?.session,
    data?.session.id,
    data?.term,
    data?.term.id,
    sessionId,
    termId,
  ]);

  function handleSessionChange(newSessionId: string) {
    setSessionId(newSessionId);
    setTermId('');
    setPage(1);
  }

  function handleTermChange(newTermId: string) {
    setTermId(newTermId);
    setPage(1);
  }

  const notEnrolled = error instanceof ApiError && error.statusCode === 404;
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
            Assignments
          </h1>
          {data && (
            <p className="font-body text-xs text-muted-foreground">
              {data.classArm.classLevel} {data.classArm.arm} &middot;{' '}
              {data.term.name} Term, {data.session.name}
            </p>
          )}
        </div>
      </div>

      <Card className="p-4">
        <SessionTermPicker
          sessionId={sessionId}
          termId={termId}
          onSessionChange={handleSessionChange}
          onTermChange={handleTermChange}
        />
      </Card>

      {notEnrolled && (
        <EmptyState
          icon={ClipboardList}
          title="Not enrolled this session"
          description="This child wasn't enrolled in a class for the selected session, so there are no assignments to show."
        />
      )}

      {needsTermPick && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Please select a term for this session to view assignments.
        </p>
      )}

      {isLoading && !data && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 w-full animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No assignments yet"
          description="No assignments have been posted for this term yet."
        />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="space-y-3">
            {data.data.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>

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
