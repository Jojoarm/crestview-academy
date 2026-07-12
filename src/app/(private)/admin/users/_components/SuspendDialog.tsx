'use client';

import { Controller, useForm } from 'react-hook-form';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

type FormValues = {
  reason: string;
};

type SuspendDialogProps = {
  open: boolean;
  entity: string; // "student", "teacher", "admin"
  name: string;
  isSuspended: boolean;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void> | void;
};

export function SuspendDialog({
  open,
  entity,
  name,
  isSuspended,
  isPending = false,
  onClose,
  onConfirm,
}: SuspendDialogProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      reason: '',
    },
  });

  async function submit(values: FormValues) {
    await onConfirm(values.reason || undefined);

    form.reset();
    onClose();
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          form.reset();
          onClose();
        }
      }}
    >
      <AlertDialogContent className="bg-(--warm-white) border-(--border-sand)">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg">
            {isSuspended ? 'Lift suspension for' : 'Suspend'} {entity}
          </AlertDialogTitle>

          <AlertDialogDescription className="font-body">
            {isSuspended
              ? `This will restore ${name}'s access to the platform.`
              : `This will revoke ${name}'s access. They will no longer be able to access their portal.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          {!isSuspended && (
            <FieldGroup>
              <Controller
                name="reason"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Reason{' '}
                      <span className="text-muted-foreground">(optional)</span>
                    </FieldLabel>

                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Reason for banning..."
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

            <Button
              type="submit"
              disabled={isPending}
              className={
                isSuspended
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }
            >
              {isPending
                ? 'Please wait...'
                : isSuspended
                  ? `Yes, list suspension for ${entity}`
                  : `Yes, suspend ${entity}`}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
