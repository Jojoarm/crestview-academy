'use client';

import { useState } from 'react';
import {
  GraduationCap,
  ArrowRightLeft,
  UserPlus,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useEnrollStudent,
  useTransferStudent,
  usePromoteStudent,
  useStudentEnrollments,
} from '@/hooks/admin/use-students';
import { useActiveSession } from '@/hooks/admin/use-sessions';
import { useClasses } from '@/hooks/admin/use-classes';
import { ApiError } from '@/lib/api-client';
import type { StudentEnrollment } from '@/types/profile';
import type { ClassLevel } from '@/types/class';

type Props = {
  studentId: string;
  activeEnrollment: StudentEnrollment | null;
};

type DialogMode = 'enroll' | 'promote' | 'repeat' | 'switch' | null;

export function EnrollmentCard({ studentId }: Props) {
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedClassArmId, setSelectedClassArmId] = useState('');

  const enrollStudent = useEnrollStudent(studentId);
  const transferStudent = useTransferStudent(studentId);
  const promoteStudent = usePromoteStudent(studentId);
  const { data: classesData } = useClasses();
  const { data: activeSession, isLoading: activeSessionLoading } =
    useActiveSession();
  const { data: fullHistory, isLoading: historyLoading } =
    useStudentEnrollments(studentId);

  const classes = classesData?.data ?? [];
  const selectedClass = classes.find(
    (c: ClassLevel) => c.id === selectedClassId,
  );
  const arms = selectedClass?.classArms ?? [];
  const isPending =
    enrollStudent.isPending ||
    transferStudent.isPending ||
    promoteStudent.isPending;

  // Enrollment matching whichever session is currently active globally,
  // found by session id against FULL history — not by the isActive flag.
  // isActive is a global pointer to the student's most recent enrollment
  // overall, not a per-session flag, so it can't answer "does this student
  // have an enrollment for the session I'm looking at" once they've been
  // promoted more than once.
  const enrollmentForViewedSession =
    fullHistory && activeSession
      ? (fullHistory.find((e) => e.session.id === activeSession.id) ?? null)
      : null;

  // The student's true current frontier — the one actually flagged
  // isActive: true. Falls back to a createdAt sort defensively in case a
  // student somehow has zero isActive:true rows.
  const mostRecentEnrollment =
    fullHistory?.find((e) => e.isActive) ??
    (fullHistory
      ? [...fullHistory].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0]
      : undefined);

  // Is the enrollment for the currently-active session also the student's
  // current frontier (i.e. they haven't since been promoted past it)?
  const isViewedSessionCurrent =
    !!enrollmentForViewedSession &&
    enrollmentForViewedSession.id === mostRecentEnrollment?.id;

  const isNewStudent =
    !historyLoading && (!fullHistory || fullHistory.length === 0);

  const needsPromotion =
    !historyLoading &&
    !activeSessionLoading &&
    !isNewStudent &&
    !enrollmentForViewedSession;

  // Active session has a record for this student, but they've since been
  // promoted past it — read-only, no actions.
  const isSupersededSession =
    !historyLoading && !!enrollmentForViewedSession && !isViewedSessionCurrent;

  function handleClose() {
    setDialogMode(null);
    setSelectedClassId('');
    setSelectedClassArmId('');
  }

  function openSwitchDialog() {
    // Class is locked to whatever the student is currently in — only the
    // arm is editable for a same-session switch.
    setSelectedClassId(
      enrollmentForViewedSession?.classArm.classLevel.id ?? '',
    );
    setSelectedClassArmId('');
    setDialogMode('switch');
  }

  async function handleSubmit() {
    try {
      if (dialogMode === 'switch') {
        if (!selectedClassArmId) return;
        await transferStudent.mutateAsync(selectedClassArmId);
        toast.success('Arm switched successfully');
      } else if (dialogMode === 'enroll') {
        if (!selectedClassArmId) return;
        await enrollStudent.mutateAsync(selectedClassArmId);
        toast.success('Student enrolled successfully');
      } else if (dialogMode === 'promote') {
        if (!selectedClassArmId || !activeSession) return;
        await promoteStudent.mutateAsync({
          toSessionId: activeSession.id,
          toClassArmId: selectedClassArmId,
        });
        toast.success('Student promoted successfully');
      } else if (dialogMode === 'repeat') {
        if (!mostRecentEnrollment || !activeSession) return;
        await promoteStudent.mutateAsync({
          toSessionId: activeSession.id,
          toClassArmId: mostRecentEnrollment.classArm.id,
        });
        toast.success('Student re-enrolled in the same class');
      }
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Failed to update enrollment',
      );
    }
  }

  if (historyLoading || activeSessionLoading) {
    return (
      <Card className="p-5 flex flex-col gap-4">
        <div className="h-5 w-40 bg-muted animate-pulse rounded" />
        <div className="h-20 bg-muted animate-pulse rounded" />
      </Card>
    );
  }

  return (
    <>
      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-terracotta-pale text-primary">
            <GraduationCap className="size-4" />
          </div>
          <h3 className="font-body text-sm font-semibold text-foreground">
            Current Enrollment
          </h3>
        </div>

        {enrollmentForViewedSession && isViewedSessionCurrent ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 p-3 bg-muted border border-border rounded">
              <p className="font-body text-sm font-medium text-foreground">
                {enrollmentForViewedSession.classArm.classLevel.name} — Arm{' '}
                {enrollmentForViewedSession.classArm.arm.name}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {enrollmentForViewedSession.session.name}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-terracotta-pale text-primary w-fit mt-1">
                Active
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={openSwitchDialog}
                className="border-border font-body gap-1.5 flex-1"
              >
                <ArrowRightLeft className="size-3.5" />
                Switch Arms
              </Button>
              <Button
                onClick={() => setDialogMode('promote')}
                className="bg-primary hover:bg-accent text-primary-foreground font-body gap-1.5 flex-1"
              >
                <TrendingUp className="size-3.5" />
                Promote
              </Button>
            </div>
          </div>
        ) : isSupersededSession ? (
          <div className="flex flex-col gap-1 p-3 bg-muted border border-border rounded">
            <p className="font-body text-xs text-muted-foreground">
              Promoted to
            </p>
            <p className="font-body text-sm font-medium text-foreground">
              {mostRecentEnrollment?.classArm.classLevel.name} — Arm{' '}
              {mostRecentEnrollment?.classArm.arm.name}
            </p>
            <p className="font-body text-xs text-muted-foreground">
              {mostRecentEnrollment?.session.name}
            </p>
          </div>
        ) : needsPromotion && mostRecentEnrollment ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 p-3 bg-muted border border-border rounded">
              <p className="font-body text-xs text-muted-foreground">
                Last enrolled in
              </p>
              <p className="font-body text-sm font-medium text-foreground">
                {mostRecentEnrollment.classArm.classLevel.name} — Arm{' '}
                {mostRecentEnrollment.classArm.arm.name}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {mostRecentEnrollment.session.name}
              </p>
            </div>
            <p className="font-body text-xs text-muted-foreground">
              Not yet enrolled for{' '}
              {activeSession?.name ?? 'the current session'}.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => setDialogMode('promote')}
                className="bg-primary hover:bg-accent text-primary-foreground font-body gap-1.5 flex-1"
              >
                <TrendingUp className="size-3.5" />
                Promote
              </Button>
              <Button
                variant="outline"
                onClick={() => setDialogMode('repeat')}
                className="border-border font-body gap-1.5 flex-1"
              >
                <RotateCcw className="size-3.5" />
                Repeat class
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="font-body text-sm text-muted-foreground">
              Not currently enrolled in any class.
            </p>
            <Button
              onClick={() => setDialogMode('enroll')}
              className="bg-primary hover:bg-accent text-primary-foreground font-body gap-1.5 w-full"
            >
              <UserPlus className="size-3.5" />
              Enroll student
            </Button>
          </div>
        )}
      </Card>

      <Dialog open={!!dialogMode} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="bg-background border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-foreground">
              {dialogMode === 'switch' && 'Switch Arms'}
              {dialogMode === 'enroll' && 'Enroll Student'}
              {dialogMode === 'promote' && 'Promote Student'}
              {dialogMode === 'repeat' && 'Repeat Class'}
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              {dialogMode === 'switch' &&
                `Currently in ${enrollmentForViewedSession?.classArm.classLevel.name} — Arm ${enrollmentForViewedSession?.classArm.arm.name}. Select the new arm within the same class.`}
              {dialogMode === 'enroll' &&
                'Select the class and arm to enroll this student.'}
              {dialogMode === 'promote' &&
                `Select the class and arm to promote this student into for ${activeSession?.name ?? 'the current session'}.`}
              {dialogMode === 'repeat' &&
                `This will re-enroll the student in ${mostRecentEnrollment?.classArm.classLevel.name} — Arm ${mostRecentEnrollment?.classArm.arm.name} for ${activeSession?.name ?? 'the current session'}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            {dialogMode === 'switch' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <p className="font-body text-xs text-muted-foreground">
                    Class
                  </p>
                  <div className="h-11 flex items-center px-3 rounded-md border border-border bg-muted font-body text-sm text-foreground">
                    {selectedClass?.name ?? '—'}
                  </div>
                </div>

                <Select
                  value={selectedClassArmId}
                  onValueChange={setSelectedClassArmId}
                  disabled={arms.length === 0}
                >
                  <SelectTrigger className="border-border focus:ring-primary h-11 font-body">
                    <SelectValue placeholder="Select new arm" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-lg">
                    {arms.map((ca) => (
                      <SelectItem
                        key={ca.id}
                        value={ca.id}
                        className="font-body"
                        disabled={
                          ca.id === enrollmentForViewedSession?.classArm.id
                        }
                      >
                        Arm {ca.arm.name}
                        <span className="text-muted-foreground ml-1 text-xs">
                          (cap: {ca.capacity})
                        </span>
                        {ca.id === enrollmentForViewedSession?.classArm.id && (
                          <span className="text-muted-foreground ml-1 text-xs">
                            (current)
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {(dialogMode === 'enroll' || dialogMode === 'promote') && (
              <>
                <Select
                  value={selectedClassId}
                  onValueChange={(v) => {
                    setSelectedClassId(v);
                    setSelectedClassArmId('');
                  }}
                >
                  <SelectTrigger className="border-border focus:ring-primary h-11 font-body">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-lg">
                    {classes.map((c: ClassLevel) => (
                      <SelectItem key={c.id} value={c.id} className="font-body">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedClassArmId}
                  onValueChange={setSelectedClassArmId}
                  disabled={!selectedClassId || arms.length === 0}
                >
                  <SelectTrigger className="border-border focus:ring-primary h-11 font-body">
                    <SelectValue
                      placeholder={
                        !selectedClassId
                          ? 'Select class first'
                          : arms.length === 0
                            ? 'No arms assigned'
                            : 'Select arm'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border shadow-lg">
                    {arms.map((ca) => (
                      <SelectItem
                        key={ca.id}
                        value={ca.id}
                        className="font-body"
                      >
                        Arm {ca.arm.name}
                        <span className="text-muted-foreground ml-1 text-xs">
                          (cap: {ca.capacity})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-border font-body"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isPending ||
                  (dialogMode !== 'repeat' && !selectedClassArmId) ||
                  ((dialogMode === 'promote' || dialogMode === 'repeat') &&
                    !activeSession)
                }
                className="bg-primary hover:bg-accent text-primary-foreground font-body"
              >
                {isPending
                  ? 'Saving...'
                  : dialogMode === 'switch'
                    ? 'Switch'
                    : dialogMode === 'enroll'
                      ? 'Enroll'
                      : dialogMode === 'promote'
                        ? 'Promote'
                        : 'Confirm Repeat'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
