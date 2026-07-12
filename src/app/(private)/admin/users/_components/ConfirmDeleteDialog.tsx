'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type ConfirmDeleteDialogProps = {
  open: boolean;
  entity: string;
  name: string;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export function ConfirmDeleteDialog({
  open,
  entity,
  name,
  isPending = false,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  async function handleConfirm() {
    await onConfirm();
    onClose();
  }

  return (
    <AlertDialog open={open} onOpenChange={(value) => !value && onClose()}>
      <AlertDialogContent className="bg-(--warm-white) border-(--border-sand)">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg">
            Delete {entity}
          </AlertDialogTitle>

          <AlertDialogDescription className="font-body">
            This will permanently delete{' '}
            <span className="font-medium">{name}</span> and all associated data.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <Button
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? 'Deleting...' : `Yes, delete ${entity}`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
