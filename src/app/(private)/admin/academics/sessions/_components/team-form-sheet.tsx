// src/app/(private)/admin/sessions/_components/term-form-sheet.tsx

'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useCreateTerm, useUpdateTerm } from '@/hooks/admin/use-sessions';
import { ApiError } from '@/lib/api-client';
import { TERM_NAMES, type Term } from '@/types/session';

const termSchema = z
  .object({
    name: z.enum(['First', 'Second', 'Third'], { message: 'Select a term' }),
    startDate: z
      .string('Start date is required')
      .min(1, 'Start date is required'),
    endDate: z.string('End date is required').min(1, 'End date is required'),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

type TermSchemaType = z.infer<typeof termSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  existingTermNames: string[];
  term: Term | null;
};

function toDateInputValue(dateString: string) {
  return dateString.split('T')[0];
}

export function TermFormSheet({
  open,
  onOpenChange,
  sessionId,
  existingTermNames,
  term,
}: Props) {
  const isEdit = !!term;
  const createTerm = useCreateTerm(sessionId);
  const updateTerm = useUpdateTerm(sessionId, term?.id ?? '');

  const form = useForm<TermSchemaType>({
    resolver: zodResolver(termSchema),
    defaultValues: { name: 'First', startDate: '', endDate: '' },
  });

  useEffect(() => {
    if (term) {
      form.reset({
        name: term.name,
        startDate: toDateInputValue(term.startDate),
        endDate: toDateInputValue(term.endDate),
      });
    } else {
      form.reset({ name: 'First', startDate: '', endDate: '' });
    }
  }, [term, open, form]);

  // Terms already added to this session (exclude current if editing)
  const takenNames = existingTermNames.filter((n) =>
    isEdit ? n !== term?.name : true,
  );

  async function onSubmit(values: TermSchemaType) {
    try {
      if (isEdit) {
        await updateTerm.mutateAsync(values);
        toast.success('Term updated');
      } else {
        await createTerm.mutateAsync(values);
        toast.success('Term created');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Failed to ${isEdit ? 'update' : 'create'} term`,
      );
    }
  }

  const isPending = createTerm.isPending || updateTerm.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-(--warm-white) border-(--border-sand) w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-heading text-xl text-(--charcoal)">
            {isEdit ? 'Edit Term' : 'New Term'}
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-(--charcoal-100)">
            {isEdit
              ? 'Update term details below.'
              : 'Add a term to this academic session.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
          <p className="font-body text-xs font-medium uppercase  tracking-widest text-terracotta-light">
            01 — Term Info
          </p>

          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="term-name"
                    className="font-body text-sm text-(--charcoal)"
                  >
                    Term
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isEdit}
                  >
                    <SelectTrigger
                      id="term-name"
                      className="border-(--border-sand) focus:ring-terracotta h-11 font-body"
                    >
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent className="bg-(--warm-white) border-(--border-sand) shadow-lg">
                      {TERM_NAMES.map((name) => (
                        <SelectItem
                          key={name}
                          value={name}
                          disabled={takenNames.includes(name)}
                          className="font-body"
                        >
                          {name} Term
                          {takenNames.includes(name) && ' (already added)'}
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
                : 'Add term'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
