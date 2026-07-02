// src/app/(private)/admin/subjects/_components/manage-assignments-sheet.tsx

'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import {
  useAssignSubjectToClass,
  useUpdateSubjectAssignment,
  useRemoveSubjectAssignment,
  useSubjects,
} from '@/hooks/admin/use-subjects';
import { useClasses } from '@/hooks/admin/use-classes';
import { ApiError } from '@/lib/api-client';
import type { Subject, ClassAssignment } from '@/types/subject';

const assignSchema = z.object({
  classLevelId: z.string().min(1, 'Select a class'),
  isCompulsory: z.boolean(),
});

type AssignFormValues = z.infer<typeof assignSchema>;

type Props = {
  subjectId: string | null;
  onClose: () => void;
};

function AssignmentRow({
  assignment,
  subjectId,
}: {
  assignment: ClassAssignment;
  subjectId: string;
}) {
  const updateAssignment = useUpdateSubjectAssignment(
    subjectId,
    assignment.classLevelId,
  );
  const removeAssignment = useRemoveSubjectAssignment(subjectId);

  async function handleToggleCompulsory(checked: boolean) {
    try {
      await updateAssignment.mutateAsync({ isCompulsory: checked });
      toast.success('Assignment updated');
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to update',
      );
    }
  }

  async function handleRemove() {
    try {
      await removeAssignment.mutateAsync(assignment.classLevelId);
      toast.success(`Removed from ${assignment.classLevel.name}`);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to remove',
      );
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4 bg-muted border border-border rounded">
      <div className="min-w-0">
        <p className="font-body text-sm font-medium text-foreground truncate">
          {assignment.classLevel.name}
        </p>
        <p className="font-body text-xs text-muted-foreground">
          {assignment.classLevel.section}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-body text-xs text-muted-foreground">
            Compulsory
          </span>
          <Switch
            checked={assignment.isCompulsory}
            onCheckedChange={handleToggleCompulsory}
            disabled={updateAssignment.isPending}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 hover:bg-red-50 text-muted-foreground hover:text-red-500"
          onClick={handleRemove}
          disabled={removeAssignment.isPending}
        >
          <Trash2 className="size-3.5" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
}

export function ManageAssignmentsSheet({ subjectId, onClose }: Props) {
  const [showForm, setShowForm] = useState(false);
  const { data } = useSubjects();
  const subject = data?.data.find((s) => s.id === subjectId) ?? null;
  const { data: classesData } = useClasses();
  const assignToClass = useAssignSubjectToClass(subject?.id ?? '');

  const assignedIds =
    subject?.classAssignments.map((a) => a.classLevelId) ?? [];
  const availableClasses = (classesData?.data ?? []).filter(
    (c) => !assignedIds.includes(c.id),
  );

  const form = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: { classLevelId: '', isCompulsory: false },
  });

  async function onSubmit(values: AssignFormValues) {
    try {
      await assignToClass.mutateAsync(values);
      toast.success('Subject assigned to class');
      form.reset({ classLevelId: '', isCompulsory: false });
      setShowForm(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to assign',
      );
    }
  }

  return (
    <Sheet open={!!subject} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-heading text-xl text-foreground">
            Class Assignments
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            Manage which classes{' '}
            <span className="font-medium text-foreground">{subject?.name}</span>{' '}
            is assigned to.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-4">
          {/* Current assignments */}
          {subject?.classAssignments.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground py-2">
              Not assigned to any class yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {subject?.classAssignments.map((assignment) => (
                <AssignmentRow
                  key={assignment.id}
                  assignment={assignment}
                  subjectId={subject.id}
                />
              ))}
            </div>
          )}

          {/* Add new assignment */}
          {!showForm ? (
            <Button
              variant="outline"
              onClick={() => setShowForm(true)}
              className="border-border font-body text-sm gap-2"
              disabled={availableClasses.length === 0}
            >
              <Plus className="size-4" />
              {availableClasses.length === 0
                ? 'Assigned to all classes'
                : 'Assign to a class'}
            </Button>
          ) : (
            <div className="border border-border p-4 flex flex-col gap-4">
              <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light">
                Assign to class
              </p>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FieldGroup>
                  <Controller
                    name="classLevelId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="classLevelId"
                          className="font-body text-sm text-foreground"
                        >
                          Class
                        </FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="classLevelId"
                            className="border-border focus:ring-primary h-11 font-body"
                          >
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border shadow-lg">
                            {availableClasses.map((c) => (
                              <SelectItem
                                key={c.id}
                                value={c.id}
                                className="font-body"
                              >
                                {c.name}
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
                    name="isCompulsory"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between">
                        <span className="font-body text-sm text-foreground">
                          Compulsory subject
                        </span>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </FieldGroup>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      form.reset();
                    }}
                    className="flex-1 border-border font-body"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={assignToClass.isPending}
                    className="flex-1 bg-primary hover:bg-accent text-primary-foreground font-body"
                  >
                    {assignToClass.isPending ? 'Assigning...' : 'Assign'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
