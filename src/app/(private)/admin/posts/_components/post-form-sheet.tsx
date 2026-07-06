'use client';

import { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
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
import { useCreatePost, useUpdatePost } from '@/hooks/admin/use-posts';
import { ApiError } from '@/lib/api-client';
import {
  POST_TYPES,
  POST_AUDIENCES,
  type Post,
  type PostType,
  type PostAudience,
} from '@/types/post';

const postSchema = z
  .object({
    title: z.string('Title is required').min(1, 'Title is required'),
    content: z.string('Content is required').min(1, 'Content is required'),
    type: z.enum(['Announcement', 'News', 'Event'], {
      message: 'Select a type',
    }),
    audience: z.enum(['Everyone', 'Teachers', 'Parents', 'Students'], {
      message: 'Select an audience',
    }),
    eventStartDate: z.string().optional(),
    eventEndDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'Event') {
        return !!data.eventStartDate && !!data.eventEndDate;
      }
      return true;
    },
    {
      message: 'Event start and end dates are required for events',
      path: ['eventStartDate'],
    },
  );

type PostSchemaType = z.infer<typeof postSchema>;
type PostFormValues = Omit<PostSchemaType, 'type' | 'audience'> & {
  type: '' | PostType;
  audience: '' | PostAudience;
};

function toDateInputValue(dateString: string | null) {
  if (!dateString) return '';
  return dateString.split('T')[0];
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
};

export function PostFormSheet({ open, onOpenChange, post }: Props) {
  const isEdit = !!post;
  const createPost = useCreatePost();
  const updatePost = useUpdatePost(post?.id ?? '');

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'Announcement',
      audience: 'Everyone',
      eventStartDate: '',
      eventEndDate: '',
    },
  });

  const selectedType = useWatch({ control: form.control, name: 'type' });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        type: post.type,
        audience: post.audience,
        eventStartDate: toDateInputValue(post.eventStartDate),
        eventEndDate: toDateInputValue(post.eventEndDate),
      });
    } else {
      form.reset({
        title: '',
        content: '',
        type: 'Announcement',
        audience: 'Everyone',
        eventStartDate: '',
        eventEndDate: '',
      });
    }
  }, [post, open, form]);

  async function onSubmit(values: PostFormValues) {
    const payload: Record<string, unknown> = {
      title: values.title,
      content: values.content,
      type: values.type,
      audience: values.audience,
    };

    if (values.type === 'Event') {
      payload.eventStartDate = values.eventStartDate;
      payload.eventEndDate = values.eventEndDate;
    }

    try {
      if (isEdit) {
        await updatePost.mutateAsync(payload as PostSchemaType);
        toast.success('Post updated');
      } else {
        await createPost.mutateAsync(payload as PostSchemaType);
        toast.success('Post created as draft');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Failed to ${isEdit ? 'update' : 'create'} post`,
      );
    }
  }

  const isPending = createPost.isPending || updatePost.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-border w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-sans font-semibold text-xl text-foreground">
            {isEdit ? 'Edit Post' : 'New Post'}
          </SheetTitle>
          <SheetDescription className="font-body text-sm text-muted-foreground">
            {isEdit
              ? 'Update the post details below.'
              : 'New posts are saved as drafts. Publish from the posts list when ready.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
          <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light">
            01 — Content
          </p>

          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Post title"
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
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-body text-sm text-foreground"
                  >
                    Content
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Write your post content here..."
                    rows={6}
                    aria-invalid={fieldState.invalid}
                    className="border-border focus-visible:ring-primary resize-none font-body text-sm"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light pt-2">
              02 — Settings
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="type"
                      className="font-body text-sm text-foreground"
                    >
                      Type
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="type"
                        className="border-border focus:ring-primary h-11 font-body"
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-lg">
                        {POST_TYPES.map((t) => (
                          <SelectItem key={t} value={t} className="font-body">
                            {t}
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

              <Controller
                name="audience"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="audience"
                      className="font-body text-sm text-foreground"
                    >
                      Audience
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="audience"
                        className="border-border focus:ring-primary h-11 font-body"
                      >
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-lg">
                        {POST_AUDIENCES.map((a) => (
                          <SelectItem key={a} value={a} className="font-body">
                            {a}
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
            </div>

            {/* Event date fields — only shown when type is Event */}
            {selectedType === 'Event' && (
              <>
                <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light pt-2">
                  03 — Event Dates
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <Controller
                    name="eventStartDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm text-foreground"
                        >
                          Start date
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
                    name="eventEndDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-body text-sm text-foreground"
                        >
                          End date
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
                </div>
              </>
            )}
          </FieldGroup>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 h-11 bg-primary hover:bg-accent text-primary-foreground font-body"
          >
            {isPending
              ? isEdit
                ? 'Saving...'
                : 'Creating...'
              : isEdit
                ? 'Save changes'
                : 'Create draft'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
