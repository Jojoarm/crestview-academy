// src/app/(private)/admin/sessions/_components/session-form-sheet.tsx

'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useCreateSession, useUpdateSession } from '@/hooks/admin/use-sessions';
import { ApiError } from '@/lib/api-client';
import type { AcademicSession } from '@/types/session';

const sessionSchema = z
  .object({
    name: z
      .string('Name is required')
      .min(1, 'Name is required')
      .regex(/^\d{4}\/\d{4}$/, 'Use format YYYY/YYYY e.g. 2025/2026'),
    startDate: z
      .string('Start date is required')
      .min(1, 'Start date is required'),
    endDate: z.string('End date is required').min(1, 'End date is required'),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

type SessionFormValues = z.infer<typeof sessionSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: AcademicSession | null;
};

function toDateInputValue(dateString: string) {
  return dateString.split('T')[0];
}

export function SessionFormSheet({ open, onOpenChange, session }: Props) {
  const isEdit = !!session;
  const createSession = useCreateSession();
  const updateSession = useUpdateSession(session?.id ?? '');

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { name: '', startDate: '', endDate: '' },
  });

  useEffect(() => {
    if (session) {
      form.reset({
        name: session.name,
        startDate: toDateInputValue(session.startDate),
        endDate: toDateInputValue(session.endDate),
      });
    } else {
      form.reset({ name: '', startDate: '', endDate: '' });
    }
  }, [session, open, form]);

  async function onSubmit(values: SessionFormValues) {
    try {
      if (isEdit) {
        await updateSession.mutateAsync(values);
        toast.success('Session updated');
      } else {
        await createSession.mutateAsync(values);
        toast.success('Session created');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Failed to ${isEdit ? 'update' : 'create'} session`,
      );
    }
  }

  const isPending = createSession.isPending || updateSession.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-(--warm-white) border-(--border-sand) w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-heading text-xl text-(--charcoal)">
            {isEdit ? 'Edit Session' : 'New Session'}
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-(--charcoal-100)">
            {isEdit
              ? 'Update session details below.'
              : 'Create a new academic session. e.g. 2025/2026'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
          <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light">
            01 — Session Info
          </p>

          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-(--charcoal)"
                  >
                    Session name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. 2025/2026"
                    aria-invalid={fieldState.invalid}
                    className="border-(--border-sand) focus-visible:ring-terracotta h-11"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light pt-2">
              02 — Dates
            </p>

            <Controller
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-(--charcoal)"
                  >
                    Start date
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="date"
                    aria-invalid={fieldState.invalid}
                    className="border-(--border-sand) focus-visible:ring-terracotta h-11"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="endDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-(--charcoal)"
                  >
                    End date
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="date"
                    aria-invalid={fieldState.invalid}
                    className="border-(--border-sand) focus-visible:ring-terracotta h-11"
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
            className="w-full mt-2 h-11 bg-terracotta hover:bg-(--terracotta-mid) text-white font-body"
          >
            {isPending
              ? isEdit
                ? 'Saving...'
                : 'Creating...'
              : isEdit
                ? 'Save changes'
                : 'Create session'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
