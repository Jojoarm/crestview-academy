'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
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
import { useCreateFeeType, useUpdateFeeType } from '@/hooks/admin/use-fees';
import { ApiError } from '@/lib/api-client';
import {
  FEE_FREQUENCIES,
  FEE_SCOPES,
  FREQUENCY_LABELS,
  SCOPE_LABELS,
  type FeeType,
} from '@/types/fee';

const feeTypeSchema = z.object({
  name: z.string('Name is required').min(1, 'Name is required'),
  description: z.string().optional(),
  frequency: z.enum(['OneTime', 'Annual', 'PerTerm'], {
    message: 'Select a frequency',
  }),
  scope: z.enum(['SchoolWide', 'PerClass'], { message: 'Select a scope' }),
  isOptional: z.boolean(),
});

type FeeTypeSchemaType = z.infer<typeof feeTypeSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeType: FeeType | null;
};

export function FeeTypeFormSheet({ open, onOpenChange, feeType }: Props) {
  const isEdit = !!feeType;
  const createFeeType = useCreateFeeType();
  const updateFeeType = useUpdateFeeType(feeType?.id ?? '');

  const form = useForm<FeeTypeSchemaType>({
    resolver: zodResolver(feeTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      frequency: 'PerTerm',
      scope: 'PerClass',
      isOptional: false,
    },
  });

  useEffect(() => {
    if (feeType) {
      form.reset({
        name: feeType.name,
        description: feeType.description ?? '',
        frequency: feeType.frequency,
        scope: feeType.scope,
        isOptional: feeType.isOptional,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        frequency: 'PerTerm',
        scope: 'PerClass',
        isOptional: false,
      });
    }
  }, [feeType, form, open]);

  async function onSubmit(values: FeeTypeSchemaType) {
    try {
      if (isEdit) {
        await updateFeeType.mutateAsync(values);
        toast.success('Fee type updated');
      } else {
        await createFeeType.mutateAsync(values);
        toast.success('Fee type created');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Failed to ${isEdit ? 'update' : 'create'} fee type`,
      );
    }
  }

  const isPending = createFeeType.isPending || updateFeeType.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-sans font-semibold text-xl text-foreground">
            {isEdit ? 'Edit Fee Type' : 'New Fee Type'}
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            {isEdit
              ? 'Update fee type details below.'
              : 'Create a new fee category e.g. Tuition, Bus, Uniform.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-4">
          <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light">
            01 — Details
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
                    Fee name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. Tuition"
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
                    placeholder="Brief description..."
                    rows={3}
                    className="border-border focus-visible:ring-primary resize-none font-body text-sm"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light pt-2">
              02 — Configuration
            </p>

            <Controller
              name="frequency"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="frequency"
                    className="font-body text-sm text-foreground"
                  >
                    Frequency
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="frequency"
                      className="border-border focus:ring-primary h-11 font-body"
                    >
                      <SelectValue placeholder="How often is this paid?" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border shadow-lg">
                      {FEE_FREQUENCIES.map((f) => (
                        <SelectItem key={f} value={f} className="font-body">
                          {FREQUENCY_LABELS[f]}
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
              name="scope"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="scope"
                    className="font-body text-sm text-foreground"
                  >
                    Scope
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="scope"
                      className="border-border focus:ring-primary h-11 font-body"
                    >
                      <SelectValue placeholder="Who pays the same amount?" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border shadow-lg">
                      {FEE_SCOPES.map((s) => (
                        <SelectItem key={s} value={s} className="font-body">
                          {SCOPE_LABELS[s]}
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
              03 — Settings
            </p>

            <Controller
              name="isOptional"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="font-body text-sm text-foreground">
                      Optional fee
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      Students can choose whether to pay this fee
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
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
                : 'Create fee type'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
