'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';

import { useGradeSubmission } from '@/hooks/teacher/use-assignments';
import type { Submission } from '@/types/teacher/assignment';

const gradeSchema = z.object({
  score: z.number('Score is required').min(0, 'Score must be 0 or higher'),
  feedback: z.string().max(2000).optional(),
});

type SchemaType = z.infer<typeof gradeSchema>;

interface GradeSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
  submission: Submission | null;
}

export function GradeSubmissionDialog({
  open,
  onOpenChange,
  assignmentId,
  submission,
}: GradeSubmissionDialogProps) {
  const gradeSubmission = useGradeSubmission(assignmentId);

  const form = useForm<SchemaType>({
    resolver: zodResolver(gradeSchema),
    defaultValues: { score: 0, feedback: '' },
  });

  useEffect(() => {
    if (!open || !submission) return;
    form.reset({
      score: submission.score ? parseFloat(submission.score) : 0,
      feedback: submission.feedback ?? '',
    });
  }, [open, submission, form]);

  async function onSubmit(values: SchemaType) {
    if (!submission || values.score === null) return;
    try {
      await gradeSubmission.mutateAsync({
        submissionId: submission.id,
        input: { score: values.score, feedback: values.feedback || undefined },
      });
      toast.success('Submission graded');
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      toast.error(message);
    }
  }

  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Grade submission</DialogTitle>
          <DialogDescription>
            {submission.student.user.name} — submitted{' '}
            {new Date(submission.submittedAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        {submission.content && (
          <div className="rounded-lg border border-border bg-muted p-3 text-sm text-foreground max-h-40 overflow-y-auto">
            {submission.content}
          </div>
        )}
        {submission.fileUrl && (
          <a
            href={submission.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary underline"
          >
            View submitted file
          </a>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            <Controller
              name="score"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Score
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    min={0}
                    step="0.5"
                    value={field.value}
                    aria-invalid={fieldState.invalid}
                    className="border-border focus-visible:ring-primary h-11"
                    onChange={(e) =>
                      field.onChange(
                        isNaN(e.target.valueAsNumber)
                          ? ''
                          : e.target.valueAsNumber,
                      )
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    No maximum is enforced yet — agree a scale with students
                    (e.g. out of 10) until total marks are supported.
                  </p>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="feedback"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Feedback
                    <span className="text-muted-foreground font-normal">
                      {' '}
                      (optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    rows={3}
                    placeholder="Notes for the student..."
                    className="border-border focus-visible:ring-primary"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={gradeSubmission.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={gradeSubmission.isPending}>
              {gradeSubmission.isPending ? 'Saving...' : 'Save grade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
