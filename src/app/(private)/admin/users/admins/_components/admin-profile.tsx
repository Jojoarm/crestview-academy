'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { ApiError } from '@/lib/api-client';
import {
  useAdminProfile,
  useUpdateAdminProfile,
} from '@/hooks/admin/use-admin';
import { UserProfileHeader } from '../../_components/UserProfileHeader';

const schema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AdminProfileDetail({ adminId }: { adminId: string }) {
  const { data: admin, isLoading } = useAdminProfile(adminId);
  const updateAdmin = useUpdateAdminProfile(adminId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: admin
      ? {
          phone: admin.phone ?? '',
          address: admin.address ?? '',
        }
      : undefined,
  });

  async function onSubmit(values: FormValues) {
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v !== undefined),
    );
    try {
      await updateAdmin.mutateAsync(payload);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to update profile',
      );
    }
  }

  if (isLoading) {
    return (
      <div className="bg-card/30 border border-border p-5">
        <div className="h-5 w-40 bg-muted animate-pulse rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-11 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="bg-card/30 border border-border p-12 text-center">
        <p className="font-body text-sm text-muted-foreground">
          Admin not found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <UserProfileHeader
        backHref="/admin/users/admins"
        name={admin.user.name}
        subtitle={admin.user.email}
        isBanned={admin.user.banned}
        avatarClassName="bg-terracotta-pale text-primary"
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 max-w-lg"
      >
        <Card className="p-5 flex flex-col gap-5">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-terracotta-light">
            01 — Contact Information
          </p>
          <FieldGroup>
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Phone
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="tel"
                    placeholder="+234..."
                    className="border-border focus-visible:ring-primary h-11"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Address
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    rows={3}
                    className="border-border focus-visible:ring-primary resize-none font-body text-sm"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </Card>

        <Button
          type="submit"
          disabled={updateAdmin.isPending}
          className="h-11 bg-primary hover:bg-accent text-primary-foreground font-body w-full sm:w-auto sm:self-start px-8"
        >
          {updateAdmin.isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </form>
    </div>
  );
}
