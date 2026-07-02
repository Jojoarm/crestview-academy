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
import { useDeleteClass } from '@/hooks/admin/use-classes';
import { ApiError } from '@/lib/api-client';
import type { ClassLevel } from '@/types/class';

type Props = {
  open: boolean;
  onClose: () => void;
  classLevel: ClassLevel;
};

export function DeleteClassDialog({ open, onClose, classLevel }: Props) {
  const deleteClass = useDeleteClass(classLevel.id);

  async function handleDelete() {
    try {
      await deleteClass.mutateAsync();
      toast.success(`"${classLevel.name}" deleted`);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to delete class',
      );
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="bg-background border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg text-foreground">
            Delete class
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-sm text-muted-foreground">
            This will permanently delete{' '}
            <span className="font-medium text-foreground">
              {classLevel.name}
            </span>{' '}
            and remove all its arm assignments. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-body border-border">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={deleteClass.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-body"
          >
            {deleteClass.isPending ? 'Deleting...' : 'Yes, delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
