'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getInitials } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { useClassArmStudents } from '@/hooks/teacher/use-class-arm-students';
import { useMarkScores, useScores } from '@/hooks/teacher/use-scores';
import type { SubjectOption } from '@/types/teacher/score';

interface ScoreDraft {
  caScore: string;
  examScore: string;
}

interface EnterScoresPanelProps {
  classArmId: string;
  subjectOptions: SubjectOption[];
}

export function EnterScoresPanel({
  classArmId,
  subjectOptions,
}: EnterScoresPanelProps) {
  const [subjectId, setSubjectId] = useState(
    subjectOptions[0]?.subjectId ?? '',
  );
  // No entry means "not yet entered" — inputs start blank, same idea as
  // attendance not defaulting to Present.
  const [drafts, setDrafts] = useState<Record<string, ScoreDraft>>({});

  useEffect(() => {
    if (!subjectOptions.some((s) => s.subjectId === subjectId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubjectId(subjectOptions[0]?.subjectId ?? '');
    }
  }, [classArmId, subjectId, subjectOptions]);

  const {
    data: roster,
    isLoading: rosterLoading,
    error: rosterError,
  } = useClassArmStudents(classArmId);

  const { data: existing, isLoading: existingLoading } = useScores({
    classArmId,
    subjectId: subjectId || undefined,
    limit: 100,
  });

  const markScores = useMarkScores();

  useEffect(() => {
    if (!roster) return;
    const existingByStudent = new Map(
      (existing?.data ?? []).map((s) => [s.studentId, s]),
    );
    const next: Record<string, ScoreDraft> = {};
    roster.forEach((s) => {
      const prev = existingByStudent.get(s.studentId);
      next[s.studentId] = {
        caScore: prev ? prev.caScore : '',
        examScore: prev ? prev.examScore : '',
      };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrafts(next);
  }, [roster, existing]);

  const isLoading = rosterLoading || existingLoading;

  function setDraft(studentId: string, field: keyof ScoreDraft, value: string) {
    setDrafts((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  }

  async function handleSubmit() {
    if (!roster || !subjectId) return;

    const records: {
      studentId: string;
      caScore: number;
      examScore: number;
    }[] = [];
    for (const student of roster) {
      const draft = drafts[student.studentId];
      if (!draft || draft.caScore === '' || draft.examScore === '') continue;
      const caScore = Number(draft.caScore);
      const examScore = Number(draft.examScore);
      if (Number.isNaN(caScore) || Number.isNaN(examScore)) continue;
      records.push({ studentId: student.studentId, caScore, examScore });
    }

    if (records.length === 0) {
      toast.error("Enter at least one student's scores before saving");
      return;
    }

    try {
      await markScores.mutateAsync({ classArmId, subjectId, records });
      toast.success('Scores saved');
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to save scores',
      );
    }
  }

  if (subjectOptions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="font-body text-sm text-muted-foreground">
          There are no subjects available to grade in this class arm yet.
        </p>
      </Card>
    );
  }

  const enteredCount = Object.values(drafts).filter(
    (d) => d.caScore !== '' && d.examScore !== '',
  ).length;
  const totalCount = roster?.length ?? 0;

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-border/30 sm:flex-row sm:items-center sm:justify-between">
        <Select value={subjectId} onValueChange={setSubjectId}>
          <SelectTrigger className="w-52 h-9 border-border font-body text-sm">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border shadow-lg">
            {subjectOptions.map((s) => (
              <SelectItem
                key={s.subjectId}
                value={s.subjectId}
                className="font-body"
              >
                {s.name} ({s.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-3">
          {!isLoading && totalCount > 0 && (
            <span className="font-body text-xs text-muted-foreground">
              {enteredCount} of {totalCount} entered
            </span>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || markScores.isPending || enteredCount === 0}
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body"
          >
            {markScores.isPending ? 'Saving...' : 'Save Scores'}
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
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground py-2 pr-3">
                  Student
                </th>
                <th className="text-left font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground py-2 px-3 w-28">
                  CA Score
                </th>
                <th className="text-left font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground py-2 pl-3 w-28">
                  Exam Score
                </th>
              </tr>
            </thead>
            <tbody>
              {roster.map((student) => (
                <tr
                  key={student.studentId}
                  className="border-b border-border/20"
                >
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {student.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={student.photoUrl}
                          alt={student.name}
                          className="size-7 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="size-7 rounded-full bg-deep-violet text-primary-foreground flex items-center justify-center text-xs font-body font-medium shrink-0">
                          {getInitials(student.name)}
                        </div>
                      )}
                      <span className="font-body text-sm text-foreground truncate">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <Input
                      type="number"
                      min={0}
                      step="0.5"
                      value={drafts[student.studentId]?.caScore ?? ''}
                      onChange={(e) =>
                        setDraft(student.studentId, 'caScore', e.target.value)
                      }
                      className="h-9 border-border font-body text-sm"
                    />
                  </td>
                  <td className="py-2 pl-3">
                    <Input
                      type="number"
                      min={0}
                      step="0.5"
                      value={drafts[student.studentId]?.examScore ?? ''}
                      onChange={(e) =>
                        setDraft(student.studentId, 'examScore', e.target.value)
                      }
                      className="h-9 border-border font-body text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
