// src/app/(private)/admin/sessions/_components/delete-term-dialog.tsx

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
import { useDeleteTerm } from '@/hooks/admin/use-sessions';
import { ApiError } from '@/lib/api-client';
import type { Term } from '@/types/session';

type Props = {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  term: Term;
};

export function DeleteTermDialog({ open, onClose, sessionId, term }: Props) {
  const deleteTerm = useDeleteTerm(sessionId, term.id);

  async function handleDelete() {
    try {
      await deleteTerm.mutateAsync();
      toast.success(`${term.name} Term deleted`);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to delete term',
      );
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="bg-(--warm-white) border-(--border-sand)">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg text-(--charcoal)">
            Delete term
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-sm text-(--charcoal-100)">
            This will permanently delete the{' '}
            <span className="font-medium text-(--charcoal)">
              {term.name} Term
            </span>
            . This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-body border-(--border-sand)">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={deleteTerm.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-body"
          >
            {deleteTerm.isPending ? 'Deleting...' : 'Yes, delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
