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
import { ApiError } from '@/lib/api-client';
import type { User } from '@/types/user';
import { useDeleteUser } from '@/hooks/admin/use-users';

type Props = {
  user: User | null;
  onClose: () => void;
};

export function DeleteUserDialog({ user, onClose }: Props) {
  const deleteUser = useDeleteUser(user?.id ?? '');

  async function handleDelete() {
    try {
      await deleteUser.mutateAsync();
      toast.success(`${user?.name} has been deleted`);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to delete user',
      );
    }
  }

  return (
    <AlertDialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-(--warm-white) border-(--border-sand)">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg text-(--charcoal)">
            Delete user
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-sm text-(--charcoal-100)">
            This will permanently delete{' '}
            <span className="font-medium text-(--charcoal)">{user?.name}</span>{' '}
            and all associated data. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-body border-(--border-sand)">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={deleteUser.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-body"
          >
            {deleteUser.isPending ? 'Deleting...' : 'Yes, delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
