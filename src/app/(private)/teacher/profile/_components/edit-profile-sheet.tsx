'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';

import { useUpdateTeacherProfile } from '@/hooks/teacher/use-teacher-profile';
import { ApiError } from '@/lib/api-client';
import type { TeacherProfile } from '@/types/teacher/teacher-profile';

const profileSchema = z.object({
  dateOfBirth: z.string().optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  address: z.string().max(500).optional(),
  photoUrl: z.url('Enter a valid URL').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  qualification: z.string().max(200).optional(),
});

type SchemaType = z.infer<typeof profileSchema>;

function toDateInputValue(iso: string | null) {
  return iso ? iso.slice(0, 10) : '';
}

interface EditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: TeacherProfile;
}

export function EditProfileSheet({
  open,
  onOpenChange,
  profile,
}: EditProfileSheetProps) {
  const updateProfile = useUpdateTeacherProfile();

  const form = useForm<SchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      dateOfBirth: '',
      gender: 'Male',
      address: '',
      photoUrl: '',
      phone: '',
      qualification: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      dateOfBirth: toDateInputValue(profile.dateOfBirth),
      gender: profile.gender ?? 'Male',
      address: profile.address ?? '',
      photoUrl: profile.photoUrl ?? '',
      phone: profile.phone ?? '',
      qualification: profile.qualification ?? '',
    });
  }, [open, profile, form]);

  async function onSubmit(values: SchemaType) {
    try {
      await updateProfile.mutateAsync({
        dateOfBirth: values.dateOfBirth
          ? new Date(values.dateOfBirth).toISOString()
          : undefined,
        gender: values.gender || undefined,
        address: values.address || undefined,
        photoUrl: values.photoUrl || undefined,
        phone: values.phone || undefined,
        qualification: values.qualification || undefined,
      });
      toast.success('Profile updated');
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to update profile',
      );
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-sans font-semibold text-xl">
            Edit Profile
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 px-4 pb-4"
        >
          <FieldGroup>
            {/* <Controller
              name="photoUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Photo URL
                    <span className="text-muted-foreground font-normal">
                      {' '}
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="https://..."
                    aria-invalid={fieldState.invalid}
                    className="border-border focus-visible:ring-primary h-11"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            /> */}

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
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-body text-sm text-foreground">
                    Gender
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="border-border focus-visible:ring-primary h-11 w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
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
                    placeholder="e.g. B.Sc. Mathematics"
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
                    aria-invalid={fieldState.invalid}
                    className="border-border focus-visible:ring-primary"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <SheetFooter className="px-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateProfile.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
