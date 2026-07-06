'use client';

import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeletePost } from '@/hooks/admin/use-posts';
import { ApiError } from '@/lib/api-client';
import type { Post } from '@/types/post';

type Props = {
  post: Post | null;
  onClose: () => void;
};

export function DeletePostDialog({ post, onClose }: Props) {
  const deletePost = useDeletePost(post?.id ?? '');

  async function handleDelete() {
    try {
      await deletePost.mutateAsync();
      toast.success(`"${post?.title}" deleted`);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to delete post',
      );
    }
  }

  return (
    <AlertDialog open={!!post} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="bg-background border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg text-foreground">
            Delete post
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-sm text-muted-foreground">
            This will permanently delete{' '}
            <span className="font-medium text-foreground">
              &ldquo;{post?.title}&rdquo;
            </span>
            . This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-body border-border">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={deletePost.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-body"
          >
            {deletePost.isPending ? 'Deleting...' : 'Yes, delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
