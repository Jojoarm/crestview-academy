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
import { useUpdateFeeStructure } from '@/hooks/admin/use-fees';
import { ApiError } from '@/lib/api-client';
import type { FeeStructure } from '@/types/fee';

const schema = z.object({
  amount: z
    .number({ message: 'Enter a valid amount' })
    .min(1, 'Must be at least 1'),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  structure: FeeStructure | null;
  onClose: () => void;
};

export function EditFeeStructureSheet({ structure, onClose }: Props) {
  const updateStructure = useUpdateFeeStructure(structure?.id ?? '');

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0 },
  });

  useEffect(() => {
    if (structure) {
      form.reset({ amount: parseFloat(structure.amount) });
    }
  }, [form, structure]);

  async function onSubmit(values: FormValues) {
    try {
      await updateStructure.mutateAsync(values.amount);
      toast.success('Amount updated');
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to update amount',
      );
    }
  }

  return (
    <Sheet open={!!structure} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-sans font-semibold text-xl text-foreground">
            Edit Amount
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            Update the amount for{' '}
            <span className="font-medium text-foreground">
              {structure?.feeType.name}
            </span>
            .
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
          <FieldGroup>
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="amount"
                    className="font-body text-sm text-foreground"
                  >
                    Amount (₦)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="amount"
                    type="number"
                    min={1}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={updateStructure.isPending}
            className="w-full mt-2 h-11 bg-primary hover:bg-accent text-primary-foreground font-body"
          >
            {updateStructure.isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
