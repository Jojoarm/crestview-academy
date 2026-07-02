// src/app/(private)/admin/sessions/_components/activate-dialog.tsx

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
import {
  useActivateSession,
  useActivateTerm,
} from '@/hooks/admin/use-sessions';
import { ApiError } from '@/lib/api-client';

type Props =
  | {
      open: boolean;
      onClose: () => void;
      type: 'session';
      name: string;
      sessionId: string;
      termId?: never;
    }
  | {
      open: boolean;
      onClose: () => void;
      type: 'term';
      name: string;
      sessionId: string;
      termId: string;
    };

export function ActivateDialog({
  open,
  onClose,
  type,
  name,
  sessionId,
  termId,
}: Props) {
  const activateSession = useActivateSession(sessionId);
  const activateTerm = useActivateTerm(sessionId, termId ?? '');

  const isPending =
    type === 'session' ? activateSession.isPending : activateTerm.isPending;

  async function handleActivate() {
    try {
      if (type === 'session') {
        await activateSession.mutateAsync();
        toast.success(`${name} is now the active session`);
      } else {
        await activateTerm.mutateAsync();
        toast.success(`${name} is now the active term`);
      }
      onClose();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : `Failed to activate ${type}`,
      );
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="bg-(--warm-white) border-(--border-sand)">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg text-(--charcoal)">
            Activate {type}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-sm text-(--charcoal-100)">
            {type === 'session'
              ? `Setting "${name}" as active will deactivate the current active session and all its active terms.`
              : `Setting "${name}" as active will deactivate the current active term in this session.`}{' '}
            This cannot be undone without manually reactivating the previous
            one.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-body border-(--border-sand)">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleActivate}
            disabled={isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-body"
          >
            {isPending ? 'Activating...' : `Yes, activate`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
