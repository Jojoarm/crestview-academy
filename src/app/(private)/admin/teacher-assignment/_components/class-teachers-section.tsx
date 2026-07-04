'use client';

import { useState } from 'react';
import { UserCheck, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRemoveClassTeacher } from '@/hooks/admin/use-teacher-assignments';
import { ApiError } from '@/lib/api-client';
import type { ClassTeacher } from '@/types/teacher-assignment';
import { AssignTeacherDialog } from './assign-teacher-dialog';

type Props = {
  classArmId: string;
  classTeachers: ClassTeacher[];
};

function ClassTeacherRow({
  classArmId,
  teacher,
}: {
  classArmId: string;
  teacher: ClassTeacher;
}) {
  const removeTeacher = useRemoveClassTeacher(classArmId);

  async function handleRemove() {
    try {
      await removeTeacher.mutateAsync(teacher.teacherId);
      toast.success(`${teacher.teacher.name} removed`);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to remove teacher',
      );
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4 bg-muted border border-border rounded">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-8 rounded-full bg-foreground image-border text-primary-foreground flex items-center justify-center text-xs font-body font-medium shrink-0">
          {teacher.teacher.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-body text-sm font-medium text-foreground truncate">
            {teacher.teacher.name}
          </p>
          <p className="font-body text-xs text-muted-foreground truncate">
            {teacher.teacher.email}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 hover:bg-red-50 text-muted-foreground hover:text-red-500 shrink-0"
        onClick={handleRemove}
        disabled={removeTeacher.isPending}
      >
        <Trash2 className="size-3.5" />
        <span className="sr-only">Remove</span>
      </Button>
    </div>
  );
}

export function ClassTeachersSection({ classArmId, classTeachers }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const assignedTeacherIds = classTeachers.map((ct) => ct.teacherId);

  return (
    <>
      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-terracotta-pale text-primary">
              <UserCheck className="size-4" />
            </div>
            <div>
              <h3 className="font-body text-sm font-semibold text-foreground">
                Class Teachers
              </h3>
              <p className="font-body text-xs text-muted-foreground">
                Responsible for overall class management
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="h-8 bg-primary hover:bg-accent text-primary-foreground font-body gap-1"
          >
            <Plus className="size-3.5" />
            Assign
          </Button>
        </div>

        {classTeachers.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground py-2">
            No class teachers assigned yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {classTeachers.map((ct) => (
              <ClassTeacherRow
                key={ct.id}
                classArmId={classArmId}
                teacher={ct}
              />
            ))}
          </div>
        )}
      </Card>

      <AssignTeacherDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        classArmId={classArmId}
        type="class"
        assignedTeacherIds={assignedTeacherIds}
      />
    </>
  );
}
