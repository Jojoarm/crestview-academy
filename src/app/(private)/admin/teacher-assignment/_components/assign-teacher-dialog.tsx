'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import {
  useAssignClassTeacher,
  useAssignSubjectTeacher,
} from '@/hooks/admin/use-teacher-assignments';
import { useUsers } from '@/hooks/admin/use-users';
import { useSubjects } from '@/hooks/admin/use-subjects';
import { ApiError } from '@/lib/api-client';
import type { SubjectTeacher } from '@/types/teacher-assignment';
import type { Section } from '@/types/class';

// Schemas

const classTeacherSchema = z.object({
  teacherId: z.string().min(1, 'Select a teacher'),
});

type ClassTeacherForm = z.infer<typeof classTeacherSchema>;

const subjectTeacherSchema = z.object({
  teacherId: z.string().min(1, 'Select a teacher'),
  subjectId: z.string().min(1, 'Select a subject'),
});

type SubjectTeacherForm = z.infer<typeof subjectTeacherSchema>;

// Props

type Props =
  | {
      open: boolean;
      onClose: () => void;
      classArmId: string;
      type: 'class';
      assignedTeacherIds: string[];
      existingSubjectTeachers?: never;
      section?: never;
    }
  | {
      open: boolean;
      onClose: () => void;
      classArmId: string;
      type: 'subject';
      assignedTeacherIds: string[];
      existingSubjectTeachers: SubjectTeacher[];
      section: string;
    };

// Class Teacher Content

function ClassTeacherDialogContent({
  classArmId,
  assignedTeacherIds,
  onClose,
}: {
  classArmId: string;
  assignedTeacherIds: string[];
  onClose: () => void;
}) {
  const assignClassTeacher = useAssignClassTeacher(classArmId);
  const { data: usersData } = useUsers({ role: 'teacher', limit: 100 });
  const teachers = (usersData?.data ?? []).filter(
    (u) => !assignedTeacherIds.includes(u.id),
  );

  const form = useForm<ClassTeacherForm>({
    resolver: zodResolver(classTeacherSchema),
    defaultValues: { teacherId: '' },
  });

  async function onSubmit(values: ClassTeacherForm) {
    try {
      await assignClassTeacher.mutateAsync(values.teacherId);
      toast.success('Class teacher assigned');
      form.reset();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to assign teacher',
      );
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
      <FieldGroup>
        <Controller
          name="teacherId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="teacherId"
                className="font-body text-sm text-foreground"
              >
                Teacher
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="teacherId"
                  className="border-border focus:ring-primary h-11 font-body"
                >
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border shadow-lg">
                  {teachers.length === 0 ? (
                    <SelectItem value="none" disabled className="font-body">
                      No teachers available
                    </SelectItem>
                  ) : (
                    teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="font-body">
                        {t.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-border font-body"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={assignClassTeacher.isPending}
          className="bg-primary hover:bg-accent text-primary-foreground font-body"
        >
          {assignClassTeacher.isPending ? 'Assigning...' : 'Assign teacher'}
        </Button>
      </div>
    </form>
  );
}

// Subject Teacher Content

function SubjectTeacherDialogContent({
  classArmId,
  existingSubjectTeachers,
  section,
  onClose,
}: {
  classArmId: string;
  existingSubjectTeachers: SubjectTeacher[];
  section: string;
  onClose: () => void;
}) {
  const assignSubjectTeacher = useAssignSubjectTeacher(classArmId);
  const { data: usersData } = useUsers({ role: 'teacher', limit: 100 });
  const { data: subjectsData } = useSubjects({
    section: section as Section,
    limit: 100,
  });

  const teachers = usersData?.data ?? [];
  const subjects = subjectsData?.data ?? [];
  const assignedSubjectIds = existingSubjectTeachers.map((st) => st.subjectId);
  const availableSubjects = subjects.filter(
    (s) => !assignedSubjectIds.includes(s.id),
  );

  const form = useForm<SubjectTeacherForm>({
    resolver: zodResolver(subjectTeacherSchema),
    defaultValues: { teacherId: '', subjectId: '' },
  });

  async function onSubmit(values: SubjectTeacherForm) {
    try {
      await assignSubjectTeacher.mutateAsync(values);
      toast.success('Subject teacher assigned');
      form.reset();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to assign teacher',
      );
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
      <FieldGroup>
        <Controller
          name="subjectId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="subjectId"
                className="font-body text-sm text-foreground"
              >
                Subject
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="subjectId"
                  className="border-border focus:ring-primary h-11 font-body"
                >
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border shadow-lg">
                  {availableSubjects.length === 0 ? (
                    <SelectItem value="none" disabled className="font-body">
                      All subjects have teachers assigned
                    </SelectItem>
                  ) : (
                    availableSubjects.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="font-body">
                        {s.name}
                        <span className="text-muted-foreground ml-1">
                          ({s.code})
                        </span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="teacherId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="teacherId"
                className="font-body text-sm text-foreground"
              >
                Teacher
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="teacherId"
                  className="border-border focus:ring-primary h-11 font-body"
                >
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border shadow-lg">
                  {teachers.length === 0 ? (
                    <SelectItem value="none" disabled className="font-body">
                      No teachers available
                    </SelectItem>
                  ) : (
                    teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="font-body">
                        {t.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-border font-body"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={assignSubjectTeacher.isPending}
          className="bg-primary hover:bg-accent text-primary-foreground font-body"
        >
          {assignSubjectTeacher.isPending ? 'Assigning...' : 'Assign teacher'}
        </Button>
      </div>
    </form>
  );
}

// Main Dialog

export function AssignTeacherDialog({
  open,
  onClose,
  classArmId,
  type,
  assignedTeacherIds,
  existingSubjectTeachers,
  section,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-background border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-foreground">
            {type === 'class'
              ? 'Assign Class Teacher'
              : 'Assign Subject Teacher'}
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground">
            {type === 'class'
              ? 'Select a teacher to assign as class teacher for this arm.'
              : 'Select a subject and assign a teacher to it for this arm.'}
          </DialogDescription>
        </DialogHeader>

        {type === 'class' ? (
          <ClassTeacherDialogContent
            classArmId={classArmId}
            assignedTeacherIds={assignedTeacherIds}
            onClose={onClose}
          />
        ) : (
          <SubjectTeacherDialogContent
            classArmId={classArmId}
            existingSubjectTeachers={existingSubjectTeachers ?? []}
            section={section ?? ''}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
