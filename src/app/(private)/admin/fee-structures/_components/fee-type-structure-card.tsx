'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useDeleteFeeStructure } from '@/hooks/admin/use-fees';
import { ApiError } from '@/lib/api-client';
import {
  FREQUENCY_LABELS,
  SCOPE_LABELS,
  type FeeType,
  type FeeStructure,
} from '@/types/fee';
import { EditFeeStructureSheet } from './edit-fee-structure-sheet';
import { SchoolWideStructures } from './SchoolWideStructures';
import { MatrixStructures } from './MatrixRenderer';
import { PerClassStructures } from './PerClassStructures';

type Props = {
  feeType: FeeType;
  structures: FeeStructure[];
  onAddStructure: () => void;
};

const FREQUENCY_COLORS: Record<string, string> = {
  OneTime: 'bg-emerald-50 text-emerald-700',
  Annual: 'bg-light-violet text-deep-violet',
  PerTerm: 'bg-terracotta-pale text-primary',
};

const SCOPE_COLORS: Record<string, string> = {
  SchoolWide: 'bg-muted text-muted-foreground',
  PerClass: 'bg-amber-50 text-amber-700',
};

export function FeeTypeStructureCard({
  feeType,
  structures,
  onAddStructure,
}: Props) {
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(
    null,
  );
  const [deletingStructure, setDeletingStructure] =
    useState<FeeStructure | null>(null);

  const deleteStructure = useDeleteFeeStructure(deletingStructure?.id ?? '');

  async function handleDelete() {
    try {
      await deleteStructure.mutateAsync();
      toast.success('Fee structure deleted');
      setDeletingStructure(null);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Failed to delete fee structure',
      );
    }
  }

  const isMatrix =
    feeType.frequency === 'PerTerm' && feeType.scope === 'PerClass';
  const isPerClass = feeType.scope === 'PerClass' && !isMatrix;

  return (
    <>
      <Card className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-sans font-semibold text-lg text-foreground">
              {feeType.name}
            </h3>
            {feeType.description && (
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                {feeType.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                  FREQUENCY_COLORS[feeType.frequency],
                )}
              >
                {FREQUENCY_LABELS[feeType.frequency]}
              </span>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                  SCOPE_COLORS[feeType.scope],
                )}
              >
                {SCOPE_LABELS[feeType.scope]}
              </span>
              {feeType.isOptional && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-muted text-muted-foreground">
                  Optional
                </span>
              )}
              <span className="font-body text-xs text-muted-foreground">
                {structures.length}{' '}
                {structures.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddStructure}
            className="h-8 border-border font-body text-xs gap-1 shrink-0"
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>

        <div className="h-px bg-border" />

        {/* Structures rendered based on type */}
        {isMatrix ? (
          <MatrixStructures
            structures={structures}
            onEdit={setEditingStructure}
            onDelete={setDeletingStructure}
          />
        ) : isPerClass ? (
          <PerClassStructures
            structures={structures}
            onEdit={setEditingStructure}
            onDelete={setDeletingStructure}
          />
        ) : (
          <SchoolWideStructures
            structures={structures}
            onEdit={setEditingStructure}
            onDelete={setDeletingStructure}
          />
        )}
      </Card>

      <EditFeeStructureSheet
        structure={editingStructure}
        onClose={() => setEditingStructure(null)}
      />

      <AlertDialog
        open={!!deletingStructure}
        onOpenChange={(o) => !o && setDeletingStructure(null)}
      >
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg text-foreground">
              Delete fee structure
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm text-muted-foreground">
              This will permanently delete this{' '}
              <span className="font-medium text-foreground">
                {feeType.name}
              </span>{' '}
              entry. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body border-border">
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={deleteStructure.isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-body"
            >
              {deleteStructure.isPending ? 'Deleting...' : 'Yes, delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
