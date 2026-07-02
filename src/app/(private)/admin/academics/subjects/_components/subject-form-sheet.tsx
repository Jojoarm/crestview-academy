'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useCreateSubject, useUpdateSubject } from '@/hooks/admin/use-subjects';
import { ApiError } from '@/lib/api-client';
import type { Subject } from '@/types/subject';

const subjectSchema = z.object({
  name: z.string('Name is required').min(1, 'Name is required'),
  code: z.string('Code is required').min(1, 'Code is required'),
  description: z.string().optional(),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: Subject | null;
};

export function SubjectFormSheet({ open, onOpenChange, subject }: Props) {
  const isEdit = !!subject;
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject(subject?.id ?? '');

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: '', code: '', description: '' },
  });

  useEffect(() => {
    if (subject) {
      form.reset({
        name: subject.name,
        code: subject.code,
        description: subject.description ?? '',
      });
    } else {
      form.reset({ name: '', code: '', description: '' });
    }
  }, [subject, open, form]);

  async function onSubmit(values: SubjectFormValues) {
    try {
      if (isEdit) {
        await updateSubject.mutateAsync(values);
        toast.success('Subject updated');
      } else {
        await createSubject.mutateAsync(values);
        toast.success('Subject created');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Failed to ${isEdit ? 'update' : 'create'} subject`,
      );
    }
  }

  const isPending = createSubject.isPending || updateSubject.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-heading text-xl text-foreground">
            {isEdit ? 'Edit Subject' : 'New Subject'}
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            {isEdit
              ? 'Update subject details below.'
              : 'Create a new subject. The code will be auto-uppercased.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
          <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light">
            01 — Subject Info
          </p>

          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Subject name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. Mathematics"
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
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Subject code
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. MTH"
                    aria-invalid={fieldState.invalid}
                    className="border-border focus-visible:ring-primary h-11 uppercase"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light pt-2">
              02 — Details
            </p>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Description{' '}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Brief description of the subject..."
                    rows={3}
                    aria-invalid={fieldState.invalid}
                    className="border-border focus-visible:ring-primary resize-none font-body text-sm"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 h-11 bg-primary hover:bg-accent text-primary-foreground font-body"
          >
            {isPending
              ? isEdit
                ? 'Saving...'
                : 'Creating...'
              : isEdit
                ? 'Save changes'
                : 'Create subject'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
