'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ApiError } from '@/lib/api-client';
import type { UserRole } from '@/lib/roles';
import type { User } from '@/types/user';
import { USER_ROLE_CONFIG } from '@/types/user';
import { useCreateUser, useUpdateUser } from '@/hooks/admin/use-users';

// --- Create schema & dual types ---
const createSchema = z.object({
  name: z.string('Name is required').min(2, 'Must be at least 2 characters'),
  email: z.email('Enter a valid email'),
  temporaryPassword: z
    .string('Password is required')
    .min(8, 'Must be at least 8 characters'),
  userRole: z.enum(['super_admin', 'admin', 'teacher', 'parent', 'student'], {
    message: 'Select a role',
  }),
});

type CreateSchemaType = z.infer<typeof createSchema>;

// Edit schema & dual type
const editSchema = z.object({
  name: z.string('Name is required').min(2, 'Must be at least 2 characters'),
  email: z.email('Enter a valid email'),
  userRole: z.enum(['super_admin', 'admin', 'teacher', 'parent', 'student'], {
    message: 'Select a role',
  }),
});

type EditSchemaType = z.infer<typeof editSchema>;

const ROLE_OPTIONS = Object.entries(USER_ROLE_CONFIG) as [
  UserRole,
  { label: string; className: string },
][];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export function UserFormSheet({ open, onOpenChange, user }: Props) {
  const isEdit = !!user;

  const createUser = useCreateUser();
  const updateUser = useUpdateUser(user?.id ?? '');

  const createForm = useForm<CreateSchemaType>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: '',
      email: '',
      temporaryPassword: '',
      userRole: 'student',
    },
  });

  const editForm = useForm<EditSchemaType>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: '', email: '', userRole: 'student' },
  });

  useEffect(() => {
    if (user) {
      editForm.reset({
        name: user.name,
        email: user.email,
        userRole: user.userRole,
      });
    } else {
      createForm.reset({
        name: '',
        email: '',
        temporaryPassword: '',
        userRole: 'student',
      });
    }
  }, [user, open, editForm, createForm]);

  async function onCreateSubmit(values: CreateSchemaType) {
    try {
      await createUser.mutateAsync(values);
      toast.success('User created and invite sent');
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to create user',
      );
    }
  }

  async function onEditSubmit(values: EditSchemaType) {
    try {
      await updateUser.mutateAsync(values);
      toast.success('User updated');
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to update user',
      );
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-(--warm-white) border-(--border-sand) w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-heading text-xl text-(--charcoal)">
            {isEdit ? 'Edit User' : 'New User'}
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-(--charcoal-100)">
            {isEdit
              ? "Update the user's information below."
              : 'Create a new account. An invite email with the temporary password will be sent.'}
          </SheetDescription>
        </SheetHeader>

        {isEdit ? (
          <form
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            className="flex flex-col gap-5 p-4"
          >
            <div className="flex flex-col gap-1">
              <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light">
                01 — Details
              </p>
            </div>

            <FieldGroup>
              <Controller
                control={editForm.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-(--charcoal)"
                    >
                      Full name
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
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
                control={editForm.control}
                name="email"
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

            <div className="flex flex-col gap-1 mt-2">
              <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light">
                02 — Role
              </p>
            </div>

            <FieldGroup>
              <Controller
                control={editForm.control}
                name="userRole"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-(--charcoal)"
                    >
                      Role
                    </FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="border-(--border-sand) focus:ring-terracotta h-11 font-body"
                      >
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>

                      <SelectContent className="bg-(--warm-white) border-(--border-sand) shadow-lg">
                        {ROLE_OPTIONS.map(([value, config]) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="font-body"
                          >
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              disabled={updateUser.isPending}
              className="mt-2 h-11 bg-terracotta hover:bg-(--terracotta-mid) text-white font-body"
            >
              {updateUser.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={createForm.handleSubmit(onCreateSubmit)}
            className="flex flex-col gap-5 p-4"
          >
            <div className="flex flex-col gap-1">
              <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light">
                01 — Details
              </p>
            </div>

            <FieldGroup>
              <Controller
                control={createForm.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-(--charcoal)"
                    >
                      Full name
                    </FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
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
                control={createForm.control}
                name="email"
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

            <div className="flex flex-col gap-1 mt-2">
              <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light">
                02 — Access
              </p>
            </div>

            <FieldGroup>
              <Controller
                control={createForm.control}
                name="temporaryPassword"
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
                control={createForm.control}
                name="userRole"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-body text-sm text-(--charcoal)"
                    >
                      Role
                    </FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="border-(--border-sand) focus:ring-terracotta h-11 font-body"
                      >
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>

                      <SelectContent className="bg-(--warm-white) border-(--border-sand) shadow-lg">
                        {ROLE_OPTIONS.map(([value, config]) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="font-body"
                          >
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

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
              className="mt-2 h-11 bg-terracotta hover:bg-(--terracotta-mid) text-white font-body"
            >
              {createUser.isPending ? 'Creating...' : 'Create user'}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
