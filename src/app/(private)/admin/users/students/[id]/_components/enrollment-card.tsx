'use client';

import { useState } from 'react';
import { GraduationCap, ArrowRightLeft, UserPlus } from 'lucide-react';
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
} from '@/hooks/admin/use-students';
import { useClasses } from '@/hooks/admin/use-classes';
import { ApiError } from '@/lib/api-client';
import type { StudentEnrollment } from '@/types/profile';
import type { ClassLevel } from '@/types/class';

type Props = {
  studentId: string;
  activeEnrollment: StudentEnrollment | null;
};

export function EnrollmentCard({ studentId, activeEnrollment }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedClassArmId, setSelectedClassArmId] = useState('');

  const enrollStudent = useEnrollStudent(studentId);
  const transferStudent = useTransferStudent(studentId);
  const { data: classesData } = useClasses();

  const classes = classesData?.data ?? [];
  const selectedClass = classes.find(
    (c: ClassLevel) => c.id === selectedClassId,
  );
  const arms = selectedClass?.classArms ?? [];
  const isTransfer = !!activeEnrollment;
  const isPending = enrollStudent.isPending || transferStudent.isPending;

  function handleClose() {
    setDialogOpen(false);
    setSelectedClassId('');
    setSelectedClassArmId('');
  }

  async function handleSubmit() {
    if (!selectedClassArmId) return;
    try {
      if (isTransfer) {
        await transferStudent.mutateAsync(selectedClassArmId);
        toast.success('Student transferred successfully');
      } else {
        await enrollStudent.mutateAsync(selectedClassArmId);
        toast.success('Student enrolled successfully');
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

        {activeEnrollment ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 p-3 bg-muted border border-border rounded">
              <p className="font-body text-sm font-medium text-foreground">
                {activeEnrollment.classArm.classLevel.name} — Arm{' '}
                {activeEnrollment.classArm.arm.name}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {activeEnrollment.session.name}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-terracotta-pale text-primary w-fit mt-1">
                Active
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(true)}
              className="border-border font-body gap-1.5 w-full"
            >
              <ArrowRightLeft className="size-3.5" />
              Transfer class
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="font-body text-sm text-muted-foreground">
              Not currently enrolled in any class.
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary hover:bg-accent text-primary-foreground font-body gap-1.5 w-full"
            >
              <UserPlus className="size-3.5" />
              Enroll student
            </Button>
          </div>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="bg-background border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-foreground">
              {isTransfer ? 'Transfer Student' : 'Enroll Student'}
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              {isTransfer
                ? `Currently in ${activeEnrollment?.classArm.classLevel.name} — Arm ${activeEnrollment?.classArm.arm.name}. Select the new class arm.`
                : 'Select the class and arm to enroll this student.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
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
                  <SelectItem key={ca.id} value={ca.id} className="font-body">
                    Arm {ca.arm.name}
                    <span className="text-muted-foreground ml-1 text-xs">
                      (cap: {ca.capacity})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
                disabled={!selectedClassArmId || isPending}
                className="bg-primary hover:bg-accent text-primary-foreground font-body"
              >
                {isPending ? 'Saving...' : isTransfer ? 'Transfer' : 'Enroll'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
