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
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';

import { useUpdateParentProfile } from '@/hooks/parent/use-parent-profile';
import { ApiError } from '@/lib/api-client';
import type { ParentProfile } from '@/types/parent/parent-profile';

const profileSchema = z.object({
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  photoUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  occupation: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof profileSchema>;

interface EditParentProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ParentProfile;
}

export function EditParentProfileSheet({
  open,
  onOpenChange,
  profile,
}: EditParentProfileSheetProps) {
  const updateProfile = useUpdateParentProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { phone: '', address: '', photoUrl: '', occupation: '' },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      phone: profile.phone ?? '',
      address: profile.address ?? '',
      photoUrl: profile.photoUrl ?? '',
      occupation: profile.occupation ?? '',
    });
  }, [open, profile, form]);

  async function onSubmit(values: FormValues) {
    try {
      await updateProfile.mutateAsync({
        phone: values.phone || undefined,
        address: values.address || undefined,
        photoUrl: values.photoUrl || undefined,
        occupation: values.occupation || undefined,
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
            <Controller
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
