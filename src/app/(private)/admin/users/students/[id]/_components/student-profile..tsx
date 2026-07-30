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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { useStudent, useUpdateStudent } from '@/hooks/admin/use-students';
import { ApiError } from '@/lib/api-client';
import { EnrollmentCard } from './enrollment-card';
import { EnrollmentHistory } from './enrollment-history';
import { LinkedParents } from './linked-parents';
import { useEffect } from 'react';
import { UserProfileHeader } from '../../../_components/UserProfileHeader';
import { ReportCardLinkCard } from './report-card-link-card';

const schema = z.object({
  gender: z.enum(['Male', 'Female']).optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  genotype: z.string().optional(),
  medicalConditions: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function toDateValue(d: string | null) {
  return d ? d.split('T')[0] : '';
}

export function StudentProfile({ studentId }: { studentId: string }) {
  const { data: student, isLoading } = useStudent(studentId);
  const updateStudent = useUpdateStudent(studentId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: undefined,
      dateOfBirth: '',
      bloodGroup: '',
      genotype: '',
      medicalConditions: '',
      address: '',
    },
  });

  useEffect(() => {
    if (!student) return;

    form.reset({
      gender: student.gender ?? undefined,
      dateOfBirth: toDateValue(student.dateOfBirth),
      bloodGroup: student.bloodGroup ?? '',
      genotype: student.genotype ?? '',
      medicalConditions: student.medicalConditions ?? '',
      address: student.address ?? '',
    });
  }, [student, form]);

  async function onSubmit(values: FormValues) {
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v !== undefined),
    );
    try {
      await updateStudent.mutateAsync(payload);
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

  if (!student) {
    return (
      <div className="bg-card border border-border p-12 text-center">
        <p className="font-body text-sm text-muted-foreground">
          Student not found.
        </p>
      </div>
    );
  }

  const activeEnrollment = student.enrollments?.find((e) => e.isActive) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <UserProfileHeader
        backHref="/admin/users/students"
        name={student.user.name}
        subtitle={student.admissionNumber}
        isBanned={student.user.banned}
        avatarClassName="bg-violet/10 text-violet"
        wrapSubtitle
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — profile form + enrollment history */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
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
                    name="bloodGroup"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm text-foreground"
                        >
                          Blood group
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="e.g. O+"
                          className="border-border focus-visible:ring-primary h-11"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="genotype"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm text-foreground"
                        >
                          Genotype
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="e.g. AA"
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
                  name="medicalConditions"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-body text-sm text-foreground"
                      >
                        Medical conditions{' '}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        rows={2}
                        placeholder="Any known conditions, allergies..."
                        className="border-border focus-visible:ring-primary resize-none font-body text-sm"
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
              disabled={updateStudent.isPending}
              className="h-11 bg-primary hover:bg-accent text-primary-foreground font-body w-full sm:w-auto sm:self-end px-8"
            >
              {updateStudent.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </form>

          <EnrollmentHistory studentId={studentId} />
        </div>

        {/* Right — enrollment + parents */}
        <div className="flex flex-col gap-5">
          <EnrollmentCard
            studentId={studentId}
            activeEnrollment={activeEnrollment}
          />
          <LinkedParents student={student} />
          <ReportCardLinkCard studentId={studentId} />
        </div>
      </div>
    </div>
  );
}
