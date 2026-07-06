'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  useCreatePeriodSlot,
  useUpdatePeriodSlot,
} from '@/hooks/admin/use-timetable';
import { ApiError } from '@/lib/api-client';
import { SECTIONS, type Section } from '@/types/class';
import type { PeriodSlot } from '@/types/timetable';

const schema = z.object({
  name: z.string('Name is required').min(1, 'Name is required'),
  section: z.enum(['Kindergarten', 'Nursery', 'Primary', 'Secondary'], {
    message: 'Select a section',
  }),
  startTime: z
    .string('Start time is required')
    .min(1, 'Start time is required'),
  endTime: z.string('End time is required').min(1, 'End time is required'),
  order: z.number({ message: 'Order is required' }).int().min(1),
  isBreak: z.boolean(),
});

type SchemaType = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: PeriodSlot | null;
  defaultSection: Section;
};

export function PeriodSlotFormSheet({
  open,
  onOpenChange,
  slot,
  defaultSection,
}: Props) {
  const isEdit = !!slot;
  const createSlot = useCreatePeriodSlot();
  const updateSlot = useUpdatePeriodSlot(slot?.id ?? '');

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      section: defaultSection,
      startTime: '',
      endTime: '',
      order: 1,
      isBreak: false,
    },
  });

  useEffect(() => {
    if (slot) {
      form.reset({
        name: slot.name,
        section: slot.section,
        startTime: slot.startTime,
        endTime: slot.endTime,
        order: slot.order,
        isBreak: slot.isBreak,
      });
    } else {
      form.reset({
        name: '',
        section: defaultSection,
        startTime: '',
        endTime: '',
        order: 1,
        isBreak: false,
      });
    }
  }, [slot, open, defaultSection, form]);

  async function onSubmit(values: SchemaType) {
    try {
      if (isEdit) {
        await updateSlot.mutateAsync(values);
        toast.success('Period slot updated');
      } else {
        await createSlot.mutateAsync(values);
        toast.success('Period slot created');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Failed to ${isEdit ? 'update' : 'create'} period slot`,
      );
    }
  }

  const isPending = createSlot.isPending || updateSlot.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-sans font-semibold text-xl text-foreground">
            {isEdit ? 'Edit Period Slot' : 'New Period Slot'}
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            {isEdit
              ? 'Update period slot details below.'
              : 'Add a new period or break to the school timetable.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
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
                    Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. Period 1, Short Break"
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
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isEdit}
                  >
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

            <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light pt-2">
              02 — Time & Order
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="startTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-foreground"
                    >
                      Start time
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="time"
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
                name="endTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-foreground"
                    >
                      End time
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="time"
                      aria-invalid={fieldState.invalid}
                      className="border-border focus-visible:ring-primary h-11"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="order"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="order"
                    className="font-body text-sm text-foreground"
                  >
                    Order
                  </FieldLabel>
                  <Input
                    {...field}
                    id="order"
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

            <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light pt-2">
              03 — Type
            </p>

            <Controller
              name="isBreak"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="font-body text-sm text-foreground">
                      Break slot
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      Break slots span all columns and have no subject
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
                : 'Create slot'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
