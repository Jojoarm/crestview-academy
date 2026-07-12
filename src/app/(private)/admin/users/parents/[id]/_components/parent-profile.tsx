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
import { useParent, useUpdateParent } from '@/hooks/admin/use-parents';
import { ApiError } from '@/lib/api-client';
import { useEffect } from 'react';
import { UserProfileHeader } from '../../../_components/UserProfileHeader';

const schema = z.object({
  phone: z.string().optional(),
  occupation: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ParentProfile({ parentId }: { parentId: string }) {
  const { data: parent, isLoading } = useParent(parentId);
  const updateParent = useUpdateParent(parentId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: '',
      occupation: '',
      address: '',
    },
  });

  useEffect(() => {
    if (!parent) return;

    form.reset({
      phone: parent.phone ?? '',
      occupation: parent.occupation ?? '',
      address: parent.address ?? '',
    });
  }, [parent, form]);

  async function onSubmit(values: FormValues) {
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v !== undefined),
    );
    try {
      await updateParent.mutateAsync(payload);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to update profile',
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-card/30 border border-border p-5">
            <div className="h-5 w-40 bg-muted animate-pulse rounded mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="h-11 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="bg-card border border-border p-12 text-center">
        <p className="font-body text-sm text-muted-foreground">
          Parent not found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <UserProfileHeader
        backHref="/admin/users/parents"
        name={parent.user.name}
        subtitle={parent.user.email}
        isBanned={parent.user.banned}
        avatarClassName="bg-emerald-50 text-emerald-700"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <Card className="p-5 flex flex-col gap-5">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-terracotta-light">
                01 — Contact Information
              </p>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    name="occupation"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm text-foreground"
                        >
                          Occupation
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="e.g. Engineer"
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
              disabled={updateParent.isPending}
              className="h-11 bg-primary hover:bg-accent text-primary-foreground font-body w-full sm:w-auto sm:self-end px-8"
            >
              {updateParent.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </div>

        {/* Linked children */}
        <div>
          <Card className="p-5 flex flex-col gap-4">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-terracotta-light">
              Linked Children
            </p>
            {parent.students.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">
                No children linked yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {parent.students.map((s) => {
                  const activeEnrollment = s.student.enrollments.find(
                    (e) => e.isActive,
                  );
                  return (
                    <div
                      key={s.student.id}
                      className="flex flex-col gap-1 py-3 px-4 bg-muted border border-border rounded"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-body text-sm font-medium text-foreground">
                          {s.student.user.name}
                        </p>

                        {s.isPrimary && (
                          <span className="font-body text-xs text-primary bg-terracotta-pale px-2 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="font-body text-xs text-muted-foreground">
                        {s.student.admissionNumber}
                      </p>
                      {activeEnrollment ? (
                        <p className="font-body text-xs text-muted-foreground">
                          {activeEnrollment.classArm.classLevel.name} — Arm{' '}
                          {activeEnrollment.classArm.arm.name}
                        </p>
                      ) : (
                        <p className="font-body text-xs text-muted-foreground italic">
                          Not enrolled
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
