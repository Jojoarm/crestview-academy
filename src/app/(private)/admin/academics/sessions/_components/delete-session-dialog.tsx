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
import { useDeleteSession } from '@/hooks/admin/use-sessions';
import { ApiError } from '@/lib/api-client';
import type { AcademicSession } from '@/types/session';

type Props = {
  open: boolean;
  onClose: () => void;
  session: AcademicSession;
};

export function DeleteSessionDialog({ open, onClose, session }: Props) {
  const deleteSession = useDeleteSession(session.id);

  async function handleDelete() {
    try {
      await deleteSession.mutateAsync();
      toast.success(`Session "${session.name}" deleted`);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to delete session',
      );
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="bg-(--warm-white) border-(--border-sand)">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg text-(--charcoal)">
            Delete session
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-sm text-(--charcoal-100)">
            This will permanently delete the{' '}
            <span className="font-medium text-(--charcoal)">
              {session.name}
            </span>{' '}
            session and all its terms. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-body border-(--border-sand)">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={deleteSession.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-body"
          >
            {deleteSession.isPending ? 'Deleting...' : 'Yes, delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
