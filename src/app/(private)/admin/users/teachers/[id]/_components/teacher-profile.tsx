'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { useTeacher, useUpdateTeacher } from '@/hooks/admin/use-teachers';
import { ApiError } from '@/lib/api-client';
import { useEffect } from 'react';
import { UserProfileHeader } from '../../../_components/UserProfileHeader';

const schema = z.object({
  phone: z.string().optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  dateOfBirth: z.string().optional(),
  dateOfEmployment: z.string().optional(),
  designation: z.string().optional(),
  qualification: z.string().optional(),
  employmentType: z.enum(['FullTime', 'PartTime', 'Contract']).optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function toDateValue(dateString: string | null) {
  if (!dateString) return '';
  return dateString.split('T')[0];
}

export function TeacherProfile({ teacherId }: { teacherId: string }) {
  const { data: teacher, isLoading } = useTeacher(teacherId);
  const updateTeacher = useUpdateTeacher(teacherId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: '',
      gender: undefined,
      dateOfBirth: '',
      dateOfEmployment: '',
      designation: '',
      qualification: '',
      employmentType: undefined,
      address: '',
    },
  });

  useEffect(() => {
    if (!teacher) return;

    form.reset({
      phone: teacher.phone ?? '',
      gender: teacher.gender ?? undefined,
      dateOfBirth: toDateValue(teacher.dateOfBirth),
      dateOfEmployment: toDateValue(teacher.dateOfEmployment),
      designation: teacher.designation ?? '',
      qualification: teacher.qualification ?? '',
      employmentType: teacher.employmentType ?? undefined,
      address: teacher.address ?? '',
    });
  }, [teacher, form]);

  async function onSubmit(values: FormValues) {
    // Strip empty strings so we don't overwrite with blanks
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v !== undefined),
    );
    try {
      await updateTeacher.mutateAsync(payload);
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
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card/30 border border-border p-5">
            <div className="h-5 w-40 bg-muted animate-pulse rounded mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-11 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="bg-card border border-border p-12 text-center">
        <p className="font-body text-sm text-muted-foreground">
          Teacher not found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <UserProfileHeader
        backHref="/admin/users/teachers"
        name={teacher.user.name}
        subtitle={teacher.employeeId}
        isBanned={teacher.user.banned}
        avatarClassName="bg-primary text-primary-foreground"
        wrapSubtitle
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Personal Info */}
        <Card className="p-5 flex flex-col gap-5">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-terracotta-light">
            01 — Personal Information
          </p>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="gender"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="gender"
                      className="font-body text-sm text-foreground"
                    >
                      Gender
                    </FieldLabel>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="gender"
                        className="border-border focus:ring-primary h-11 font-body"
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-lg">
                        <SelectItem value="Male" className="font-body">
                          Male
                        </SelectItem>
                        <SelectItem value="Female" className="font-body">
                          Female
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="dateOfBirth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-foreground"
                    >
                      Date of birth
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      className="border-border focus-visible:ring-primary h-11"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

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
                name="qualification"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-foreground"
                    >
                      Qualification
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="e.g. B.Ed Mathematics"
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

        {/* Employment Info */}
        <Card className="p-5 flex flex-col gap-5">
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-terracotta-light">
            02 — Employment
          </p>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="designation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-foreground"
                    >
                      Designation
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="e.g. Senior Teacher"
                      className="border-border focus-visible:ring-primary h-11"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="employmentType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="employmentType"
                      className="font-body text-sm text-foreground"
                    >
                      Employment type
                    </FieldLabel>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="employmentType"
                        className="border-border focus:ring-primary h-11 font-body"
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-lg">
                        <SelectItem value="FullTime" className="font-body">
                          Full Time
                        </SelectItem>
                        <SelectItem value="PartTime" className="font-body">
                          Part Time
                        </SelectItem>
                        <SelectItem value="Contract" className="font-body">
                          Contract
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="dateOfEmployment"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-foreground"
                    >
                      Date of employment
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      className="border-border focus-visible:ring-primary h-11"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </Card>

        <Button
          type="submit"
          disabled={updateTeacher.isPending}
          className="h-11 bg-primary hover:bg-accent text-primary-foreground font-body w-full sm:w-auto sm:self-end px-8"
        >
          {updateTeacher.isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </form>
    </div>
  );
}
