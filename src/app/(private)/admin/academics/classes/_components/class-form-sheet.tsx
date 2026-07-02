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
import { useCreateClass, useUpdateClass } from '@/hooks/admin/use-classes';
import { ApiError } from '@/lib/api-client';
import { SECTIONS, type ClassLevel } from '@/types/class';

const classSchema = z.object({
  name: z.string('Name is required').min(1, 'Name is required'),
  section: z.enum(['Kindergarten', 'Nursery', 'Primary', 'Secondary'], {
    message: 'Select a section',
  }),
});

type ClassSchemaType = z.infer<typeof classSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classLevel: ClassLevel | null;
};

export function ClassFormSheet({ open, onOpenChange, classLevel }: Props) {
  const isEdit = !!classLevel;
  const createClass = useCreateClass();
  const updateClass = useUpdateClass(classLevel?.id ?? '');

  const form = useForm<ClassSchemaType>({
    resolver: zodResolver(classSchema),
    defaultValues: { name: '', section: 'Primary' },
  });

  useEffect(() => {
    if (classLevel) {
      form.reset({
        name: classLevel.name,
        section: classLevel.section,
      });
    } else {
      form.reset({ name: '', section: 'Primary' });
    }
  }, [classLevel, form, open]);

  async function onSubmit(values: ClassSchemaType) {
    try {
      if (isEdit) {
        await updateClass.mutateAsync(values);
        toast.success('Class updated');
      } else {
        await createClass.mutateAsync(values);
        toast.success('Class created');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Failed to ${isEdit ? 'update' : 'create'} class`,
      );
    }
  }

  const isPending = createClass.isPending || updateClass.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-heading text-xl text-foreground">
            {isEdit ? 'Edit Class' : 'New Class'}
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            {isEdit
              ? 'Update class details below.'
              : 'Create a new class level for the school.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
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
                    Class name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. Primary 1"
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
              name="section"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="section"
                    className="font-body text-sm text-foreground"
                  >
                    Section
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="section"
                      className="border-border focus:ring-primary h-11 font-body"
                    >
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border shadow-lg">
                      {SECTIONS.map((s) => (
                        <SelectItem key={s} value={s} className="font-body">
                          {s}
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
                : 'Create class'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
