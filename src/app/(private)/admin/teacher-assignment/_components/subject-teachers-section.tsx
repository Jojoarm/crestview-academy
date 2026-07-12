'use client';

import { useState } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRemoveSubjectTeacher } from '@/hooks/admin/use-teacher-assignments';
import { ApiError } from '@/lib/api-client';
import type { SubjectTeacher } from '@/types/teacher-assignment';
import { AssignTeacherDialog } from './assign-teacher-dialog';

type Props = {
  classArmId: string;
  subjectTeachers: SubjectTeacher[];
  section: string;
};

function SubjectTeacherRow({
  classArmId,
  subjectTeacher,
}: {
  classArmId: string;
  subjectTeacher: SubjectTeacher;
}) {
  const removeTeacher = useRemoveSubjectTeacher(classArmId);

  async function handleRemove() {
    try {
      await removeTeacher.mutateAsync({
        subjectId: subjectTeacher.subjectId,
        teacherId: subjectTeacher.teacherId,
      });
      toast.success(
        `${subjectTeacher.teacher.user.name} removed from ${subjectTeacher.subject.name}`,
      );
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to remove teacher',
      );
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4 bg-muted border border-border rounded">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-8 rounded-full bg-deep-violet text-white flex items-center justify-center text-xs font-body font-medium shrink-0">
          {subjectTeacher.subject.code.slice(0, 3)}
        </div>
        <div className="min-w-0">
          <p className="font-body text-sm font-medium text-foreground truncate">
            {subjectTeacher.subject.name}
          </p>
          <p className="font-body text-xs text-muted-foreground truncate">
            {subjectTeacher.teacher.user.name}
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

export function SubjectTeachersSection({
  classArmId,
  subjectTeachers,
  section,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-light-violet text-deep-violet">
              <BookOpen className="size-4" />
            </div>
            <div>
              <h3 className="font-body text-sm font-semibold text-foreground">
                Subject Teachers
              </h3>
              <p className="font-body text-xs text-muted-foreground">
                Teachers assigned per subject for this arm
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

        {subjectTeachers.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground py-2">
            No subject teachers assigned yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {subjectTeachers.map((st) => (
              <SubjectTeacherRow
                key={st.id}
                classArmId={classArmId}
                subjectTeacher={st}
              />
            ))}
          </div>
        )}
      </Card>

      <AssignTeacherDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        classArmId={classArmId}
        type="subject"
        assignedTeacherIds={[]}
        existingSubjectTeachers={subjectTeachers}
        section={section}
      />
    </>
  );
}
