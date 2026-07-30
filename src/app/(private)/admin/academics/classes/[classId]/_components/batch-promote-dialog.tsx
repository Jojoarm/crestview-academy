/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { useSessions } from '@/hooks/admin/use-sessions';
import { useBatchPromoteStudents } from '@/hooks/admin/use-students';
import { ApiError } from '@/lib/api-client';
import type { ClassLevel } from '@/types/class';
import type { ClassArmStudent } from '@/types/class';

interface BatchPromoteDialogProps {
  open: boolean;
  onClose: () => void;
  students: ClassArmStudent[]; // the selected students, already filtered by caller
  classes: ClassLevel[];
  onSuccess: () => void;
}

export function BatchPromoteDialog({
  open,
  onClose,
  students,
  classes,
  onSuccess,
}: BatchPromoteDialogProps) {
  const { data: sessionsData } = useSessions();
  const sessions = sessionsData?.data ?? [];
  const batchPromote = useBatchPromoteStudents();

  const [toSessionId, setToSessionId] = useState('');
  const [defaultClassId, setDefaultClassId] = useState('');
  const [defaultArmId, setDefaultArmId] = useState('');
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  // Reset on open with a fresh selection.
  useEffect(() => {
    if (open) {
      setToSessionId('');
      setDefaultClassId('');
      setDefaultArmId('');
      setOverrides({});
    }
  }, [open]);

  const defaultClass = classes.find((c) => c.id === defaultClassId);
  const defaultArms = defaultClass?.classArms ?? [];

  function handleOverrideChange(studentId: string, classArmId: string) {
    setOverrides((prev) => ({ ...prev, [studentId]: classArmId }));
  }

  const isReady = !!toSessionId && !!defaultArmId;
  const isPending = batchPromote.isPending;

  async function handleSubmit() {
    if (!isReady) return;
    const payload = {
      toSessionId,
      students: students.map((s) => ({
        studentId: s.id,
        toClassArmId: overrides[s.id] ?? defaultArmId,
      })),
    };
    try {
      const result = await batchPromote.mutateAsync(payload);
      toast.success(`${result.promotedCount} student(s) promoted`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Failed to promote students',
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-background border-border sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-foreground">
            Promote {students.length} Student{students.length === 1 ? '' : 's'}
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground">
            Choose the target session and a default destination class. You can
            override individual students below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <Select value={toSessionId} onValueChange={setToSessionId}>
            <SelectTrigger className="border-border focus:ring-primary h-11 font-body">
              <SelectValue placeholder="Select target session" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              {sessions.map((s) => (
                <SelectItem key={s.id} value={s.id} className="font-body">
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select
              value={defaultClassId}
              onValueChange={(v) => {
                setDefaultClassId(v);
                setDefaultArmId('');
              }}
            >
              <SelectTrigger className="border-border focus:ring-primary h-11 font-body">
                <SelectValue placeholder="Default class" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg">
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="font-body">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={defaultArmId}
              onValueChange={setDefaultArmId}
              disabled={!defaultClassId}
            >
              <SelectTrigger className="border-border focus:ring-primary h-11 font-body">
                <SelectValue placeholder="Default arm" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg">
                {defaultArms.map((ca) => (
                  <SelectItem key={ca.id} value={ca.id} className="font-body">
                    Arm {ca.arm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {defaultArmId && (
            <div className="flex flex-col gap-2 border-t border-border pt-3">
              <p className="font-body text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Per-student destination (optional override)
              </p>
              {students.map((student) => {
                const currentArmId = overrides[student.id] ?? defaultArmId;
                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <p className="font-body text-sm text-foreground truncate">
                      {student.user.name}
                    </p>
                    <Select
                      value={currentArmId}
                      onValueChange={(v) => handleOverrideChange(student.id, v)}
                    >
                      <SelectTrigger className="border-border h-9 font-body text-xs w-40 shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-lg">
                        {classes.flatMap((c) =>
                          c.classArms.map((ca) => (
                            <SelectItem
                              key={ca.id}
                              value={ca.id}
                              className="font-body text-xs"
                            >
                              {c.name} — Arm {ca.arm.name}
                            </SelectItem>
                          )),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border font-body"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isReady || isPending}
              className="bg-primary hover:bg-accent text-primary-foreground font-body"
            >
              {isPending ? 'Promoting...' : 'Confirm Promotion'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
