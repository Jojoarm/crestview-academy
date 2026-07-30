'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';

import { useClasses } from '@/hooks/admin/use-classes';
import { useSessions } from '@/hooks/admin/use-sessions';
import { useClassArmStudents } from '@/hooks/admin/use-class-arm-students';
import { ArmSwitcher } from './arm-switcher';
import { RosterTable } from './roster-table';
import { BatchPromoteDialog } from './batch-promote-dialog';
import { SessionPicker } from './session-picker';

const LIMIT = 20;

export function ClassDetailView({ classId }: { classId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: classesData } = useClasses();
  const { data: sessionsData } = useSessions();
  const classes = classesData?.data ?? [];
  const sessions = sessionsData?.data ?? [];
  const classLevel = classes.find((c) => c.id === classId);

  const armIdParam = searchParams.get('armId');
  const activeArmId = armIdParam || classLevel?.classArms[0]?.id || '';

  const sessionIdParam = searchParams.get('sessionId');
  // Default the picker to whichever session the backend considers active,
  // once we know it — falls back to '' (backend default) until then.
  const activeSessionId =
    sessionIdParam || sessions.find((s) => s.isActive)?.id || '';

  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [promoteOpen, setPromoteOpen] = useState(false);

  const { data: rosterData, isLoading } = useClassArmStudents(activeArmId, {
    sessionId: activeSessionId || undefined,
    page,
    limit: LIMIT,
  });

  function updateQuery(next: { armId?: string; sessionId?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.armId) params.set('armId', next.armId);
    if (next.sessionId) params.set('sessionId', next.sessionId);
    setSelectedIds(new Set());
    setPage(1);
    router.push(`/admin/academics/classes/${classId}?${params.toString()}`);
  }

  function handleArmChange(armId: string) {
    updateQuery({ armId, sessionId: activeSessionId });
  }

  function handleSessionChange(sessionId: string) {
    updateQuery({ armId: activeArmId, sessionId });
  }

  function toggleStudent(studentId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  function toggleAll() {
    if (!rosterData) return;
    const allSelected = rosterData.data.every((s) => selectedIds.has(s.id));
    setSelectedIds(
      allSelected ? new Set() : new Set(rosterData.data.map((s) => s.id)),
    );
  }

  const selectedStudents =
    rosterData?.data.filter((s) => selectedIds.has(s.id)) ?? [];
  const viewingSession = sessions.find((s) => s.id === activeSessionId);

  if (!classLevel) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/admin/academics/classes')}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="font-sans font-semibold text-xl text-foreground">
            {classLevel.name}
          </h1>
          <p className="font-body text-xs text-muted-foreground">
            {classLevel.section}
          </p>
        </div>
      </div>

      <Card className="p-4 flex flex-row flex-wrap justify-between gap-3">
        <ArmSwitcher
          classLevel={classLevel}
          activeArmId={activeArmId}
          onArmChange={handleArmChange}
        />
        <SessionPicker
          sessionId={activeSessionId}
          onSessionChange={handleSessionChange}
        />
      </Card>

      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-terracotta-pale px-4 py-2.5">
          <p className="font-body text-sm text-primary font-medium">
            {selectedIds.size} student{selectedIds.size === 1 ? '' : 's'}{' '}
            selected
          </p>
          <Button
            size="sm"
            onClick={() => setPromoteOpen(true)}
            className="h-8 bg-primary hover:bg-accent text-primary-foreground font-body gap-1.5"
          >
            <TrendingUp className="size-3.5" />
            Promote Selected
          </Button>
        </div>
      )}

      {isLoading && !rosterData && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      )}

      {rosterData && rosterData.data.length === 0 && (
        <EmptyState
          icon={Users}
          title="No students in this arm"
          description={
            viewingSession
              ? `No students were enrolled in this arm for ${viewingSession.name}.`
              : 'No students are currently enrolled in this class arm.'
          }
        />
      )}

      {rosterData && rosterData.data.length > 0 && (
        <Card className="p-4 overflow-x-auto">
          <RosterTable
            students={rosterData.data}
            selectedIds={selectedIds}
            onToggle={toggleStudent}
            onToggleAll={toggleAll}
          />
        </Card>
      )}

      {rosterData && rosterData.meta.totalPages > 1 && (
        <Pagination
          page={rosterData.meta.page}
          totalPages={rosterData.meta.totalPages}
          total={rosterData.meta.total}
          limit={rosterData.meta.limit}
          onPageChange={setPage}
        />
      )}

      <BatchPromoteDialog
        open={promoteOpen}
        onClose={() => setPromoteOpen(false)}
        students={selectedStudents}
        classes={classes}
        onSuccess={() => setSelectedIds(new Set())}
      />
    </div>
  );
}
