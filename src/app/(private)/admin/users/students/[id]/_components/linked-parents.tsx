'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { useLinkParent } from '@/hooks/admin/use-students';
import { useParents } from '@/hooks/admin/use-parents';
import { ApiError } from '@/lib/api-client';
import type { Student } from '@/types/profile';
import { ParentCard } from './ParentCard';

const schema = z.object({
  parentId: z.string().min(1, 'Select a parent'),
  relationship: z.enum(['Father', 'Mother', 'Guardian'], {
    message: 'Select a relationship',
  }),
  isPrimary: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type Props = { student: Student };

export function LinkedParents({ student }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const linkParent = useLinkParent(student.id);
  const { data: parentsData } = useParents({ limit: 100 });

  const linkedParentIds = student.parents.map((p) => p.parent.id);
  const availableParents = (parentsData?.data ?? []).filter(
    (p) => !linkedParentIds.includes(p.id),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { parentId: '', relationship: 'Father', isPrimary: false },
  });

  async function onSubmit(values: FormValues) {
    try {
      await linkParent.mutateAsync(values);
      toast.success('Parent linked successfully');
      form.reset();
      setDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to link parent',
      );
    }
  }

  return (
    <>
      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Users className="size-4" />
            </div>
            <h3 className="font-body text-sm font-semibold text-foreground">
              Parents / Guardians
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="h-7 text-xs font-body text-primary hover:bg-terracotta-pale gap-1"
          >
            <Plus className="size-3" />
            Link parent
          </Button>
        </div>

        {student.parents.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">
            No parents linked yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {student.parents.map((p) => (
              <ParentCard
                key={p.parent.id}
                studentId={student.id}
                parentId={p.parent.id}
                name={p.parent.user.name}
                email={p.parent.user.email}
                relationship={p.relationship}
                isPrimary={p.isPrimary}
              />
            ))}
          </div>
        )}
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          if (!o) {
            form.reset();
            setDialogOpen(false);
          }
        }}
      >
        <DialogContent className="bg-background border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-foreground">
              Link Parent
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              Select a parent account to link to {student.user.name}.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            <FieldGroup>
              <Controller
                name="parentId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="parentId"
                      className="font-body text-sm text-foreground"
                    >
                      Parent
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="parentId"
                        className="border-border focus:ring-primary h-11 font-body"
                      >
                        <SelectValue placeholder="Select parent" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-lg">
                        {availableParents.length === 0 ? (
                          <SelectItem
                            value="none"
                            disabled
                            className="font-body"
                          >
                            No available parents
                          </SelectItem>
                        ) : (
                          availableParents.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.id}
                              className="font-body"
                            >
                              {p.user.name}
                              <span className="text-muted-foreground ml-1 text-xs">
                                · {p.user.email}
                              </span>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="relationship"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="relationship"
                      className="font-body text-sm text-foreground"
                    >
                      Relationship
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="relationship"
                        className="border-border focus:ring-primary h-11 font-body"
                      >
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-lg">
                        <SelectItem value="Father" className="font-body">
                          Father
                        </SelectItem>
                        <SelectItem value="Mother" className="font-body">
                          Mother
                        </SelectItem>
                        <SelectItem value="Guardian" className="font-body">
                          Guardian
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
                name="isPrimary"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="font-body text-sm text-foreground">
                        Primary contact
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        Main point of contact for this student
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </FieldGroup>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setDialogOpen(false);
                }}
                className="border-border font-body"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={linkParent.isPending}
                className="bg-primary hover:bg-accent text-primary-foreground font-body"
              >
                {linkParent.isPending ? 'Linking...' : 'Link parent'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
