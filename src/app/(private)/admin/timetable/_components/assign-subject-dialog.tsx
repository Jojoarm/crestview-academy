'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
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
  useCreateTimetableEntry,
  useUpdateTimetableEntry,
  useDeleteTimetableEntry,
} from '@/hooks/admin/use-timetable';
import { useSubjects } from '@/hooks/admin/use-subjects';
import { ApiError } from '@/lib/api-client';
import type { DayOfWeek, TimetableEntry, PeriodSlot } from '@/types/timetable';
import type { Section } from '@/types/class';

const schema = z.object({
  subjectId: z.string().min(1, 'Select a subject'),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  classArmId: string;
  periodSlot: PeriodSlot;
  day: DayOfWeek;
  existingEntry: TimetableEntry | null;
  section: Section;
};

export function AssignSubjectDialog({
  open,
  onClose,
  classArmId,
  periodSlot,
  day,
  existingEntry,
  section,
}: Props) {
  const isEdit = !!existingEntry;

  const createEntry = useCreateTimetableEntry(classArmId);
  const updateEntry = useUpdateTimetableEntry(classArmId);
  const deleteEntry = useDeleteTimetableEntry(classArmId);

  const { data: subjectsData } = useSubjects({ section, limit: 100 });
  const subjects = subjectsData?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      subjectId: existingEntry?.subjectId ?? '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      if (isEdit) {
        await updateEntry.mutateAsync({
          entryId: existingEntry.id,
          subjectId: values.subjectId,
        });
        toast.success('Subject updated');
      } else {
        await createEntry.mutateAsync({
          periodSlotId: periodSlot.id,
          dayOfWeek: day,
          subjectId: values.subjectId,
        });
        toast.success('Subject assigned');
      }
      onClose();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to save');
    }
  }

  async function handleRemove() {
    if (!existingEntry) return;
    try {
      await deleteEntry.mutateAsync(existingEntry.id);
      toast.success('Entry removed');
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to remove',
      );
    }
  }

  const isPending =
    createEntry.isPending || updateEntry.isPending || deleteEntry.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-background border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-foreground">
            {isEdit ? 'Change Subject' : 'Assign Subject'}
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground">
            {day} · {periodSlot.name} · {periodSlot.startTime} —{' '}
            {periodSlot.endTime}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-2">
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
                      {subjects.length === 0 ? (
                        <SelectItem value="none" disabled className="font-body">
                          No subjects for this section
                        </SelectItem>
                      ) : (
                        subjects.map((s) => (
                          <SelectItem
                            key={s.id}
                            value={s.id}
                            className="font-body"
                          >
                            {s.name}
                            <span className="text-muted-foreground ml-1">
                              ({s.code})
                            </span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex gap-2">
            {isEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                disabled={isPending}
                className="border-red-200 text-red-600 hover:bg-red-50 font-body gap-1.5"
              >
                <Trash2 className="size-3.5" />
                Remove
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border font-body ml-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-accent text-primary-foreground font-body"
            >
              {isPending ? 'Saving...' : isEdit ? 'Update' : 'Assign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
