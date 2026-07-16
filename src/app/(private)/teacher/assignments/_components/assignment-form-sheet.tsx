'use client';

import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { useTeacherSubjects } from '@/hooks/teacher/use-subjects';
import {
  useCreateAssignment,
  useUpdateAssignment,
} from '@/hooks/teacher/use-assignments';
import type { Assignment, AssignmentType } from '@/types/teacher/assignment';
import { formatClassArmLabel } from '@/lib/utils';

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(['Typed', 'FileUpload']),
  classArmId: z.string().min(1, 'Select a class'),
  subjectId: z.string().min(1, 'Select a subject'),
  dueDate: z.string().min(1, 'Due date is required'),
  isPublished: z.boolean(),
});

type SchemaType = z.infer<typeof assignmentSchema>;

const emptyDefaults: SchemaType = {
  title: '',
  description: '',
  type: 'Typed',
  classArmId: '',
  subjectId: '',
  dueDate: '',
  isPublished: false,
};

function toDateInputValue(iso: string) {
  return iso ? iso.slice(0, 10) : '';
}

interface AssignmentFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment?: Assignment;
}

export function AssignmentFormSheet({
  open,
  onOpenChange,
  assignment,
}: AssignmentFormSheetProps) {
  const isEditing = !!assignment;

  const { data: subjectAssignments, isLoading: subjectsLoading } =
    useTeacherSubjects();

  const createAssignment = useCreateAssignment();
  const updateAssignment = useUpdateAssignment(assignment?.id ?? '');
  const isSubmitting = createAssignment.isPending || updateAssignment.isPending;

  const form = useForm<SchemaType>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (!open) return;
    if (assignment) {
      form.reset({
        title: assignment.title,
        description: assignment.description ?? '',
        type: assignment.type,
        classArmId: assignment.classArmId,
        subjectId: assignment.subjectId,
        dueDate: toDateInputValue(assignment.dueDate),
        isPublished: assignment.isPublished,
      });
    } else {
      form.reset(emptyDefaults);
    }
  }, [open, assignment, form]);

  const selectedClassArmId = useWatch({
    control: form.control,
    name: 'classArmId',
  });

  // Only offer subjects the teacher is actually assigned for the chosen
  // class arm — keeps invalid class/subject combinations unselectable.
  const classArmOptions = useMemo(() => {
    if (!subjectAssignments) return [];
    const seen = new Set<string>();
    return subjectAssignments.filter((sa) => {
      if (seen.has(sa.classArmId)) return false;
      seen.add(sa.classArmId);
      return true;
    });
  }, [subjectAssignments]);

  const subjectOptions = useMemo(() => {
    if (!subjectAssignments || !selectedClassArmId) return [];
    const seen = new Set<string>();
    return subjectAssignments.filter((sa) => {
      if (sa.classArmId !== selectedClassArmId) return false;
      if (seen.has(sa.subjectId)) return false;
      seen.add(sa.subjectId);
      return true;
    });
  }, [subjectAssignments, selectedClassArmId]);

  function handleClassArmChange(value: string) {
    form.setValue('classArmId', value, { shouldValidate: true });
    // Selected subject may no longer be valid for the new class — reset it.
    form.setValue('subjectId', '', { shouldValidate: false });
  }

  async function onSubmit(values: SchemaType) {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      type: values.type as AssignmentType,
      classArmId: values.classArmId,
      subjectId: values.subjectId,
      dueDate: new Date(values.dueDate).toISOString(),
      isPublished: values.isPublished,
    };

    try {
      if (isEditing) {
        await updateAssignment.mutateAsync(payload);
        toast.success('Assignment updated');
      } else {
        await createAssignment.mutateAsync(payload);
        toast.success('Assignment created');
      }
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      toast.error(message);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-sans font-semibold text-xl">
            {isEditing ? 'Edit Assignment' : 'New Assignment'}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 px-4 pb-4"
        >
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Algebra Worksheet 3"
                    className="border-border focus-visible:ring-primary h-11"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Description
                    <span className="text-muted-foreground font-normal">
                      {' '}
                      (optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    rows={3}
                    placeholder="Instructions for students..."
                    className="border-border focus-visible:ring-primary"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-body text-sm text-foreground">
                    Type
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="border-border focus-visible:ring-primary h-11 w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Typed">Typed response</SelectItem>
                      <SelectItem value="FileUpload">File upload</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="classArmId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-body text-sm text-foreground">
                    Class
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleClassArmChange}
                    disabled={subjectsLoading}
                  >
                    <SelectTrigger
                      className="border-border focus-visible:ring-primary h-11 w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue
                        placeholder={
                          subjectsLoading ? 'Loading...' : 'Select a class'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {classArmOptions.map((sa) => (
                        <SelectItem key={sa.classArmId} value={sa.classArmId}>
                          {formatClassArmLabel(sa.classArm)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="subjectId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-body text-sm text-foreground">
                    Subject
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedClassArmId || subjectsLoading}
                  >
                    <SelectTrigger
                      className="border-border focus-visible:ring-primary h-11 w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue
                        placeholder={
                          !selectedClassArmId
                            ? 'Select a class first'
                            : 'Select a subject'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((sa) => (
                        <SelectItem key={sa.subjectId} value={sa.subjectId}>
                          {sa.subject.name} ({sa.subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="dueDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Due date
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="date"
                    aria-invalid={fieldState.invalid}
                    className="border-border focus-visible:ring-primary h-11"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="isPublished"
              control={form.control}
              render={({ field }) => (
                <Field className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                  <div className="space-y-0.5">
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-foreground"
                    >
                      Publish immediately
                    </FieldLabel>
                    <p className="text-xs text-muted-foreground">
                      Drafts stay hidden from students until published.
                    </p>
                  </div>
                  <Switch
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>

          <SheetFooter className="px-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Save changes'
                  : 'Create assignment'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
