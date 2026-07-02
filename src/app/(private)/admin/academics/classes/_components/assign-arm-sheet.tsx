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
import {
  useArms,
  useAssignArm,
  useUpdateClassArm,
} from '@/hooks/admin/use-classes';
import { ApiError } from '@/lib/api-client';
import type { ClassLevel, ClassArm } from '@/types/class';

const assignSchema = z.object({
  armId: z.string('Select an arm').min(1, 'Select an arm'),
  capacity: z.number('Capacity is required').int().min(1, 'Must be at least 1'),
});

type AssignSchemaType = z.infer<typeof assignSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classLevel: ClassLevel;
  editingArm: ClassArm | null;
};

export function AssignArmSheet({
  open,
  onOpenChange,
  classLevel,
  editingArm,
}: Props) {
  const isEdit = !!editingArm;
  const { data: armsData } = useArms();
  const assignArm = useAssignArm(classLevel.id);
  const updateArm = useUpdateClassArm(classLevel.id, editingArm?.armId ?? '');

  const arms = armsData?.data ?? [];

  // Arms already assigned to this class (exclude current if editing)
  const assignedArmIds = classLevel.classArms
    .map((ca) => ca.armId)
    .filter((id) => (isEdit ? id !== editingArm?.armId : true));

  const form = useForm<AssignSchemaType>({
    resolver: zodResolver(assignSchema),
    defaultValues: { armId: '', capacity: 30 },
  });

  useEffect(() => {
    if (editingArm) {
      form.reset({ armId: editingArm.armId, capacity: editingArm.capacity });
    } else {
      form.reset({ armId: '', capacity: 30 });
    }
  }, [editingArm, form, open]);

  async function onSubmit(values: AssignSchemaType) {
    try {
      if (isEdit) {
        await updateArm.mutateAsync({ capacity: values.capacity });
        toast.success('Arm capacity updated');
      } else {
        await assignArm.mutateAsync(values);
        toast.success('Arm assigned to class');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to assign arm',
      );
    }
  }

  const isPending = assignArm.isPending || updateArm.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-heading text-xl text-foreground">
            {isEdit ? 'Edit Arm Capacity' : 'Assign Arm'}
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            {isEdit
              ? `Update the capacity for Arm ${editingArm?.arm.name} in ${classLevel.name}.`
              : `Assign an arm to ${classLevel.name} and set its student capacity.`}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
          <FieldGroup>
            <Controller
              name="armId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="arm-id"
                    className="font-body text-sm text-foreground"
                  >
                    Arm
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isEdit}
                  >
                    <SelectTrigger
                      id="arm-id"
                      className="border-border focus:ring-primary h-11 font-body"
                    >
                      <SelectValue placeholder="Select arm" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border shadow-lg">
                      {arms.map((arm) => (
                        <SelectItem
                          key={arm.id}
                          value={arm.id}
                          disabled={assignedArmIds.includes(arm.id)}
                          className="font-body"
                        >
                          Arm {arm.name}
                          {assignedArmIds.includes(arm.id) &&
                            ' (already assigned)'}
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
              name="capacity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Capacity
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
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
            disabled={isPending}
            className="w-full mt-2 h-11 bg-primary hover:bg-accent text-primary-foreground font-body"
          >
            {isPending
              ? 'Saving...'
              : isEdit
                ? 'Update capacity'
                : 'Assign arm'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
