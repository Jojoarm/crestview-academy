// src/app/(auth)/change-password/change-password-form.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { apiClient, ApiError } from '@/lib/api-client';
import { getDashboardPathForRole, type UserRole } from '@/lib/roles';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

const changePasswordSchema = z
  .object({
    currentPassword: z.string('Current password is required').min(1),
    newPassword: z
      .string('New password is required')
      .min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string('Please confirm your new password').min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function ChangePasswordForm({ userRole }: { userRole: UserRole }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: ChangePasswordValues) {
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          revokeOtherSessions: true,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.message ??
            'Could not change password. Check your current password.',
        );
      }

      await apiClient.post('/api/profile/me/clear-force-password');

      toast.success('Password updated');
      router.push(getDashboardPathForRole(userRole));
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup>
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={field.name}
                className="font-body text-sm text-(--charcoal)"
              >
                Temporary password
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                className="border-(--border-sand) focus-visible:ring-terracotta h-11"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={field.name}
                className="font-body text-sm text-(--charcoal)"
              >
                New password
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                className="border-(--border-sand) focus-visible:ring-terracotta h-11"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={field.name}
                className="font-body text-sm text-(--charcoal)"
              >
                Confirm new password
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                className="border-(--border-sand) focus-visible:ring-terracotta h-11"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-terracotta hover:bg-(--terracotta-mid) text-white font-body tracking-wide"
      >
        {isSubmitting ? 'Updating...' : 'Update password'}
      </Button>
    </form>
  );
}
