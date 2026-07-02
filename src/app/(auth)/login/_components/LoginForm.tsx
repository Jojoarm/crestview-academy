'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCurrentUser } from '@/hooks/use-current-user';
import { apiClient, ApiError } from '@/lib/api-client';
import { getDashboardPathForRole } from '@/lib/roles';
import { CurrentUser } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string('Password is required').min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.forcePasswordChange) {
        router.replace('/auth/change-password');
      } else {
        router.replace(getDashboardPathForRole(user.userRole));
      }
    }
  }, [user, isLoading, router]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginValues) {
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? 'Invalid email or password');
      }

      // Sign-in succeeded — now fetch our own profile to get userRole + forcePasswordChange
      const user = await apiClient.get<CurrentUser>('/api/profile/me');

      if (user.forcePasswordChange) {
        router.push('/change-password');
        return;
      }

      router.push(getDashboardPathForRole(user.userRole));
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
    <div className="bg-white border border-(--border-sand) px-8 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl text-(--charcoal)">
          Welcome back
        </h1>
        <p className="font-body text-sm text-(--charcoal-100) mt-2">
          Sign in to access your dashboard
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="font-body text-sm text-(--charcoal)"
                >
                  Email
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  className="border-(--border-sand) focus-visible:ring-terracotta h-11"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-(--charcoal)"
                  >
                    Password
                  </FieldLabel>

                  <a
                    href="/auth/forgot-password"
                    className="text-xs font-body text-terracotta hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                  className="border-(--border-sand) focus-visible:ring-terracotta h-11"
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
          disabled={isSubmitting}
          className="w-full h-11 bg-terracotta hover:bg-(--terracotta-mid) text-white font-body tracking-wide"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}
