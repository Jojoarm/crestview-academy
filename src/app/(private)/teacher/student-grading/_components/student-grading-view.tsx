'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useTeacherClasses } from '@/hooks/teacher/use-classes';
import { useTeacherSubjects } from '@/hooks/teacher/use-subjects';
import { useClassArmSubjects } from '@/hooks/teacher/use-class-arm-subjects';
import type { SubjectOption } from '@/types/teacher/score';
import { EnterScoresPanel } from './enter-scores-panel';
import { ScoresheetPanel } from './scoresheet-panel';
import { TeacherClassArm } from '@/types/teacher/teacher';
import { useTeacherSessions } from '@/hooks/teacher/use-teacher-session';
import { formatClassArmLabel } from '@/lib/utils';

interface ClassArmOption {
  classArmId: string;
  classArm: TeacherClassArm;
  isClassTeacher: boolean;
}

export function StudentGradingView() {
  const { data: sessions, isLoading: sessionsLoading } = useTeacherSessions();
  const [sessionId, setSessionId] = useState('');
  const [termId, setTermId] = useState('');

  useEffect(() => {
    if (!sessions || sessions.length === 0 || sessionId) return;
    const active = sessions.find((s) => s.isActive) ?? sessions[0];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId(active.id);
    const activeTerm = active.terms.find((t) => t.isActive) ?? active.terms[0];
    setTermId(activeTerm?.id ?? '');
  }, [sessionId, sessions]);

  const selectedSession = sessions?.find((s) => s.id === sessionId);

  function handleSessionChange(newSessionId: string) {
    setSessionId(newSessionId);
    const session = sessions?.find((s) => s.id === newSessionId);
    const nextTerm =
      session?.terms.find((t) => t.isActive) ?? session?.terms[0];
    setTermId(nextTerm?.id ?? '');
  }

  const { data: homeroomClasses, isLoading: classesLoading } =
    useTeacherClasses(sessionId);
  const { data: subjectAssignments, isLoading: subjectsLoading } =
    useTeacherSubjects(sessionId);

  const [classArmId, setClassArmId] = useState('');

  // A teacher may see a class arm here for either reason (or both): they're
  // the homeroom/class teacher, or they teach a subject there. Merge into
  // one switcher rather than showing two separate pickers.
  const classArmOptions = useMemo<ClassArmOption[]>(() => {
    const map = new Map<string, ClassArmOption>();
    (homeroomClasses ?? []).forEach((ca) => {
      map.set(ca.id, {
        classArmId: ca.id,
        classArm: ca,
        isClassTeacher: true,
      });
    });
    (subjectAssignments ?? []).forEach((sa) => {
      if (!map.has(sa.classArmId)) {
        map.set(sa.classArmId, {
          classArmId: sa.classArmId,
          classArm: sa.classArm,
          isClassTeacher: false,
        });
      }
    });
    return Array.from(map.values());
  }, [homeroomClasses, subjectAssignments]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClassArmId('');
  }, [sessionId]);

  const activeClassArmId = classArmId || classArmOptions[0]?.classArmId || '';
  const activeOption = classArmOptions.find(
    (o) => o.classArmId === activeClassArmId,
  );
  const isClassTeacherForActive = !!activeOption?.isClassTeacher;

  const subjectsForClass = useMemo(() => {
    if (!subjectAssignments) return [];
    const seen = new Set<string>();
    return subjectAssignments.filter((sa) => {
      if (sa.classArmId !== activeClassArmId) return false;
      if (seen.has(sa.subjectId)) return false;
      seen.add(sa.subjectId);
      return true;
    });
  }, [subjectAssignments, activeClassArmId]);

  // Class teachers can grade any subject offered at the class's level, not
  // just ones they personally teach — fetch the full class-level list only
  // for them, scoped to the selected session.
  const { data: classLevelSubjects, isLoading: classLevelSubjectsLoading } =
    useClassArmSubjects(activeClassArmId, isClassTeacherForActive, sessionId);

  const subjectOptions = useMemo<SubjectOption[]>(() => {
    if (isClassTeacherForActive) {
      return (classLevelSubjects ?? []).map((s) => ({
        subjectId: s.subjectId,
        name: s.name,
        code: s.code,
      }));
    }
    return subjectsForClass.map((sa) => ({
      subjectId: sa.subjectId,
      name: sa.subject.name,
      code: sa.subject.code,
    }));
  }, [isClassTeacherForActive, classLevelSubjects, subjectsForClass]);

  const isLoading =
    sessionsLoading ||
    classesLoading ||
    subjectsLoading ||
    (isClassTeacherForActive && classLevelSubjectsLoading);

  if (isLoading) {
    return <div className="h-40 w-full animate-pulse rounded-xl bg-muted" />;
  }

  if (classArmOptions.length === 0) {
    return (
      <div className="space-y-6">
        <SessionTermPicker
          sessions={sessions}
          sessionId={sessionId}
          termId={termId}
          selectedSession={selectedSession}
          onSessionChange={handleSessionChange}
          onTermChange={setTermId}
        />
        <div className="rounded-xl border border-border p-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            You don&apos;t have any class or subject assignments for{' '}
            {selectedSession?.name ?? 'this session'}, so there&apos;s nothing
            to grade here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-semibold text-2xl text-foreground">
            Student Grading
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Enter CA and exam scores, and review scoresheets for your classes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SessionTermPicker
            sessions={sessions}
            sessionId={sessionId}
            termId={termId}
            selectedSession={selectedSession}
            onSessionChange={handleSessionChange}
            onTermChange={setTermId}
          />

          {classArmOptions.length > 1 && (
            <Select value={activeClassArmId} onValueChange={setClassArmId}>
              <SelectTrigger className="w-44 h-9 border-border font-body text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg">
                {classArmOptions.map((o) => (
                  <SelectItem
                    key={o.classArmId}
                    value={o.classArmId}
                    className="font-body"
                  >
                    {formatClassArmLabel(o.classArm)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs defaultValue="enter" className="w-full">
        <TabsList>
          <TabsTrigger value="enter" className="font-body">
            Enter Scores
          </TabsTrigger>
          <TabsTrigger value="sheet" className="font-body">
            Scoresheet
          </TabsTrigger>
        </TabsList>
        <TabsContent value="enter" className="mt-4">
          <EnterScoresPanel
            classArmId={activeClassArmId}
            subjectOptions={subjectOptions}
            sessionId={sessionId}
            termId={termId}
          />
        </TabsContent>
        <TabsContent value="sheet" className="mt-4">
          <ScoresheetPanel
            classArmId={activeClassArmId}
            subjectOptions={subjectOptions}
            sessionId={sessionId}
            termId={termId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SessionTermPicker({
  sessions,
  sessionId,
  termId,
  selectedSession,
  onSessionChange,
  onTermChange,
}: {
  sessions: { id: string; name: string }[] | undefined;
  sessionId: string;
  termId: string;
  selectedSession: { terms: { id: string; name: string }[] } | undefined;
  onSessionChange: (sessionId: string) => void;
  onTermChange: (termId: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Select value={sessionId} onValueChange={onSessionChange}>
        <SelectTrigger className="w-36 h-9 border-border font-body text-sm">
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
        onValueChange={onTermChange}
        disabled={!selectedSession}
      >
        <SelectTrigger className="w-32 h-9 border-border font-body text-sm">
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
  );
}
