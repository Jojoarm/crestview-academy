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
import { useUnlinkParent } from '@/hooks/admin/use-students';

type Props = {
  open: boolean;
  onClose: () => void;
  studentId: string;
  parentId: string;
  parentName: string;
};

export function UnlinkParentDialog({
  open,
  onClose,
  studentId,
  parentId,
  parentName,
}: Props) {
  const unlinkParent = useUnlinkParent(studentId);

  async function handleUnlink() {
    await unlinkParent.mutateAsync(parentId);
    toast.success(`${parentName} has been unlinked`);
    onClose();
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-(--warm-white) border-(--border-sand)">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg text-(--charcoal)">
            Unlink parent
          </AlertDialogTitle>

          <AlertDialogDescription className="font-body text-sm text-(--charcoal-100)">
            This will remove{' '}
            <span className="font-medium text-(--charcoal)">{parentName}</span>{' '}
            from this student&apos;s linked parents. This action does not delete
            the parent account and can be reversed later by linking the parent
            again.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="font-body border-(--border-sand)"
            disabled={unlinkParent.isPending}
          >
            Cancel
          </AlertDialogCancel>

          <Button
            onClick={handleUnlink}
            disabled={unlinkParent.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-body"
          >
            {unlinkParent.isPending ? 'Unlinking...' : 'Yes, unlink'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
