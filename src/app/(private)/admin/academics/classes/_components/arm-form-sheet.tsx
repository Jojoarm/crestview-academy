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
import { useCreateArm, useUpdateArm } from '@/hooks/admin/use-classes';
import { ApiError } from '@/lib/api-client';
import type { Arm } from '@/types/class';

const armSchema = z.object({
  name: z
    .string('Arm name is required')
    .min(1, 'Arm name is required')
    .max(20, 'Keep it short — e.g. A, Gold, Blue'),
});

type ArmFormValues = z.infer<typeof armSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  arm: Arm | null;
};

export function ArmFormSheet({ open, onOpenChange, arm }: Props) {
  const isEdit = !!arm;
  const createArm = useCreateArm();
  const updateArm = useUpdateArm(arm?.id ?? '');

  const form = useForm<ArmFormValues>({
    resolver: zodResolver(armSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (arm) {
      form.reset({ name: arm.name });
    } else {
      form.reset({ name: '' });
    }
  }, [arm, form, open]);

  async function onSubmit(values: ArmFormValues) {
    try {
      if (isEdit) {
        await updateArm.mutateAsync(values);
        toast.success('Arm updated');
      } else {
        await createArm.mutateAsync(values);
        toast.success('Arm created');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Failed to ${isEdit ? 'update' : 'create'} arm`,
      );
    }
  }

  const isPending = createArm.isPending || updateArm.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-sans font-semibold text-xl text-foreground">
            {isEdit ? 'Edit Arm' : 'New Arm'}
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            {isEdit
              ? 'Update the arm name below.'
              : 'Arms are shared across all classes. e.g. A, B, Gold, Blue.'}
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
                    Arm name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. A, Gold, Blue"
                    aria-invalid={fieldState.invalid}
                    className="border-border focus-visible:ring-primary h-11"
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
                : 'Create arm'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
