// src/app/(private)/admin/subjects/_components/delete-subject-dialog.tsx

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
import { useDeleteSubject } from '@/hooks/admin/use-subjects';
import { ApiError } from '@/lib/api-client';
import type { Subject } from '@/types/subject';

type Props = {
  subject: Subject | null;
  onClose: () => void;
};

export function DeleteSubjectDialog({ subject, onClose }: Props) {
  const deleteSubject = useDeleteSubject(subject?.id ?? '');

  async function handleDelete() {
    try {
      await deleteSubject.mutateAsync();
      toast.success(`"${subject?.name}" deleted`);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to delete subject',
      );
    }
  }

  return (
    <AlertDialog open={!!subject} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="bg-background border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg text-foreground">
            Delete subject
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-sm text-muted-foreground">
            This will permanently delete{' '}
            <span className="font-medium text-foreground">{subject?.name}</span>
            . It cannot be deleted if it has class assignments — remove those
            first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-body border-border">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={deleteSubject.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-body"
          >
            {deleteSubject.isPending ? 'Deleting...' : 'Yes, delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
