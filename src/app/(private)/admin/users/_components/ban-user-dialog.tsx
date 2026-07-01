// src/app/(private)/admin/users/_components/ban-user-dialog.tsx

'use client';

import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { ApiError } from '@/lib/api-client';
import type { User } from '@/types/user';
import { useBanUser, useUnbanUser } from '@/hooks/admin/use-users';

type Props = {
  user: User | null;
  onClose: () => void;
};

export function BanUserDialog({ user, onClose }: Props) {
  const isBanned = user?.banned ?? false;

  const ban = useBanUser(user?.id ?? '');
  const unban = useUnbanUser(user?.id ?? '');

  const form = useForm<{ reason: string }>({
    defaultValues: { reason: '' },
  });

  async function onSubmit({ reason }: { reason: string }) {
    try {
      if (isBanned) {
        await unban.mutateAsync();
        toast.success(`${user?.name} has been unbanned`);
      } else {
        await ban.mutateAsync({ reason: reason || undefined });
        toast.success(`${user?.name} has been banned`);
      }
      onClose();
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Failed to update user status',
      );
    }
  }

  const isPending = ban.isPending || unban.isPending;

  return (
    <AlertDialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-(--warm-white) border-(--border-sand)">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg text-(--charcoal)">
            {isBanned ? 'Unban user' : 'Ban user'}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-sm text-(--charcoal-100)">
            {isBanned
              ? `This will restore ${user?.name}'s access to the platform.`
              : `This will revoke ${user?.name}'s access. They will not be able to log in.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!isBanned && (
            <FieldGroup>
              <Controller
                name="reason"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-(--charcoal)"
                    >
                      Reason{' '}
                      <span className="text-(--charcoal-100)">(optional)</span>
                    </FieldLabel>

                    <Textarea
                      {...field}
                      id={field.name}
                      placeholder="Provide a reason for the ban..."
                      rows={3}
                      aria-invalid={fieldState.invalid}
                      className="border-(--border-sand) focus-visible:ring-terracotta font-body text-sm resize-none"
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
            <AlertDialogCancel
              className="font-body border-(--border-sand)"
              onClick={() => form.reset()}
            >
              Cancel
            </AlertDialogCancel>

            <Button
              type="submit"
              disabled={isPending}
              className={
                isBanned
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-body'
                  : 'bg-amber-600 hover:bg-amber-700 text-white font-body'
              }
            >
              {isPending
                ? 'Please wait...'
                : isBanned
                  ? 'Yes, unban'
                  : 'Yes, ban'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
