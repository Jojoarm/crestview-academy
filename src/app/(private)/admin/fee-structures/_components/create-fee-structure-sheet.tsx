'use client';

import { useEffect, useState } from 'react';
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
import { useCreateFeeStructure, useFeeTypes } from '@/hooks/admin/use-fees';
import { useClasses } from '@/hooks/admin/use-classes';
import { useSessions } from '@/hooks/admin/use-sessions';
import { ApiError } from '@/lib/api-client';
import {
  getRequiredFields,
  FREQUENCY_LABELS,
  SCOPE_LABELS,
  type FeeType,
} from '@/types/fee';

const schema = z.object({
  feeTypeId: z.string().min(1, 'Select a fee type'),
  amount: z
    .number({ message: 'Enter a valid amount' })
    .min(1, 'Must be at least 1'),
  classLevelId: z.string().optional(),
  sessionId: z.string().optional(),
  termId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedFeeTypeId?: string | null;
};

export function CreateFeeStructureSheet({
  open,
  onOpenChange,
  preselectedFeeTypeId,
}: Props) {
  const [selectedFeeType, setSelectedFeeType] = useState<FeeType | null>(null);

  const createFeeStructure = useCreateFeeStructure();
  const { data: feeTypesData } = useFeeTypes();
  const { data: classesData } = useClasses();
  const { data: sessionsData } = useSessions();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const feeTypes = feeTypesData?.data ?? [];
  const classes = classesData?.data ?? [];
  const activeSession = sessionsData?.data?.find((s) => s.isActive);
  const terms = activeSession?.terms ?? [];

  const required = selectedFeeType
    ? getRequiredFields(selectedFeeType.frequency, selectedFeeType.scope)
    : { needsClassLevel: false, needsSession: false, needsTerm: false };

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      feeTypeId: '',
      amount: 0,
      classLevelId: '',
      sessionId: '',
      termId: '',
    },
  });

  // When a fee type is preselected (triggered from a card), auto-select it
  useEffect(() => {
    if (open && preselectedFeeTypeId && feeTypes.length > 0) {
      const ft = feeTypes.find((f) => f.id === preselectedFeeTypeId) ?? null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFeeType(ft);
      form.setValue('feeTypeId', preselectedFeeTypeId);
    }
  }, [open, preselectedFeeTypeId, feeTypes, form]);

  function handleFeeTypeChange(feeTypeId: string) {
    const ft = feeTypes.find((f) => f.id === feeTypeId) ?? null;
    setSelectedFeeType(ft);
    form.setValue('feeTypeId', feeTypeId);
    form.setValue('classLevelId', '');
    form.setValue('sessionId', '');
    form.setValue('termId', '');
  }

  function handleClose() {
    form.reset();
    setSelectedFeeType(null);
    onOpenChange(false);
  }

  async function onSubmit(values: FormValues) {
    const payload: Record<string, unknown> = {
      feeTypeId: values.feeTypeId,
      amount: values.amount,
    };
    if (required.needsClassLevel && values.classLevelId)
      payload.classLevelId = values.classLevelId;
    if (required.needsSession && values.sessionId)
      payload.sessionId = values.sessionId;
    if (required.needsTerm && values.termId) payload.termId = values.termId;

    try {
      await createFeeStructure.mutateAsync(payload as FormValues);
      toast.success('Fee structure created');
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Failed to create fee structure',
      );
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-sans font-semibold text-xl text-foreground">
            New Fee Structure
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            {preselectedFeeTypeId
              ? `Adding a new entry for ${selectedFeeType?.name ?? 'this fee type'}.`
              : 'Select a fee type first — the required fields will update automatically.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
          <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light">
            01 — Fee Type
          </p>

          <FieldGroup>
            <Controller
              name="feeTypeId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="feeTypeId"
                    className="font-body text-sm text-foreground"
                  >
                    Fee type
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleFeeTypeChange}
                    disabled={!!preselectedFeeTypeId}
                  >
                    <SelectTrigger
                      id="feeTypeId"
                      className="border-border focus:ring-primary h-11 font-body"
                    >
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border shadow-lg">
                      {feeTypes.map((ft) => (
                        <SelectItem
                          key={ft.id}
                          value={ft.id}
                          className="font-body"
                        >
                          {ft.name}
                          <span className="text-muted-foreground ml-1 text-xs">
                            · {FREQUENCY_LABELS[ft.frequency]} ·{' '}
                            {SCOPE_LABELS[ft.scope]}
                          </span>
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

            {/* Fee type badges */}
            {selectedFeeType && (
              <div className="flex gap-2 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-terracotta-pale text-primary">
                  {FREQUENCY_LABELS[selectedFeeType.frequency]}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-light-violet text-deep-violet">
                  {SCOPE_LABELS[selectedFeeType.scope]}
                </span>
                {selectedFeeType.isOptional && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-muted text-muted-foreground">
                    Optional
                  </span>
                )}
              </div>
            )}

            <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light pt-2">
              02 — Amount
            </p>

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

            {/* Conditional context fields */}
            {selectedFeeType &&
              (required.needsClassLevel ||
                required.needsSession ||
                required.needsTerm) && (
                <>
                  <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light pt-2">
                    03 — Context
                  </p>

                  {required.needsClassLevel && (
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
                              {classes.map((c) => (
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
                  )}

                  {required.needsSession && (
                    <Controller
                      name="sessionId"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="sessionId"
                            className="font-body text-sm text-foreground"
                          >
                            Session
                          </FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id="sessionId"
                              className="border-border focus:ring-primary h-11 font-body"
                            >
                              <SelectValue placeholder="Select session" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-border shadow-lg">
                              {(sessionsData?.data ?? []).map((s) => (
                                <SelectItem
                                  key={s.id}
                                  value={s.id}
                                  className="font-body"
                                >
                                  {s.name}
                                  {s.isActive && (
                                    <span className="text-muted-foreground ml-1">
                                      (active)
                                    </span>
                                  )}
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
                  )}

                  {required.needsTerm && (
                    <Controller
                      name="termId"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor="termId"
                            className="font-body text-sm text-foreground"
                          >
                            Term
                          </FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={terms.length === 0}
                          >
                            <SelectTrigger
                              id="termId"
                              className="border-border focus:ring-primary h-11 font-body"
                            >
                              <SelectValue
                                placeholder={
                                  terms.length === 0
                                    ? 'No terms in active session'
                                    : 'Select term'
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-border shadow-lg">
                              {terms.map((t) => (
                                <SelectItem
                                  key={t.id}
                                  value={t.id}
                                  className="font-body"
                                >
                                  {t.name} Term
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
                  )}
                </>
              )}
          </FieldGroup>

          <Button
            type="submit"
            disabled={createFeeStructure.isPending || !selectedFeeType}
            className="w-full mt-2 h-11 bg-primary hover:bg-accent text-primary-foreground font-body"
          >
            {createFeeStructure.isPending ? 'Creating...' : 'Create structure'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
