// src/components/admin/create-user-sheet.tsx

'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { useCreateUser } from '@/hooks/admin/use-users';
import { ApiError } from '@/lib/api-client';
import type { UserRole } from '@/lib/roles';

const schema = z.object({
  name: z.string('Name is required').min(2, 'Must be at least 2 characters'),
  email: z.email('Enter a valid email'),
  temporaryPassword: z
    .string('Password is required')
    .min(8, 'Must be at least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

const ROLE_LABELS: Record<string, string> = {
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: UserRole;
  onSuccess?: (userId: string, roleRecordId: string) => void;
  invalidateKey?: string;
};

export function CreateUserSheet({
  open,
  onOpenChange,
  role,
  onSuccess,
  invalidateKey,
}: Props) {
  const createUser = useCreateUser(invalidateKey);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', temporaryPassword: '' },
  });

  async function onSubmit(values: FormValues) {
    try {
      const user = await createUser.mutateAsync({
        ...values,
        userRole: role,
      });

      toast.success(`${ROLE_LABELS[role]} account created. Invite email sent.`);

      // Get the role record id from the response
      const roleRecord =
        user.teacher ?? user.student ?? user.parent ?? user.admin;

      onSuccess?.(user.id, roleRecord?.id ?? '');
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to create account',
      );
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-sans font-semibold text-xl text-foreground">
            New {ROLE_LABELS[role]}
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            Creates the account and sends an invite email with the temporary
            password. Complete the profile after creation.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body font-medium text-sm text-foreground"
                  >
                    Full name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. Ibrahim Musa"
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
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body font-medium text-sm text-foreground"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
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
              name="temporaryPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body font-medium text-sm text-foreground"
                  >
                    Temporary password
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    className="border-border focus-visible:ring-primary h-11"
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
            disabled={createUser.isPending}
            className="w-full mt-2 h-11 bg-primary hover:bg-accent text-primary-foreground font-body"
          >
            {createUser.isPending ? 'Creating...' : 'Create account'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
