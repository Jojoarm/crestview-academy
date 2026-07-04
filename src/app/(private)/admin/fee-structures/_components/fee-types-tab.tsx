'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { useFeeTypes, useDeleteFeeType } from '@/hooks/admin/use-fees';
import { ApiError } from '@/lib/api-client';
import type { FeeType } from '@/types/fee';
import { FeeTypeFormSheet } from './fee-type-form-sheet';

export function FeeTypesTab() {
  const { data, isLoading } = useFeeTypes();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingFeeType, setEditingFeeType] = useState<FeeType | null>(null);
  const [deletingFeeType, setDeletingFeeType] = useState<FeeType | null>(null);

  const deleteFeeType = useDeleteFeeType(deletingFeeType?.id ?? '');
  const feeTypes = data?.data ?? [];

  async function handleDelete() {
    try {
      await deleteFeeType.mutateAsync();
      toast.success(`"${deletingFeeType?.name}" deleted`);
      setDeletingFeeType(null);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to delete fee type',
      );
    }
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-semibold text-lg text-foreground">
              Fee Types
            </h2>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              School wide fee categories e.g. Tuition, Bus, Uniform
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingFeeType(null);
              setSheetOpen(true);
            }}
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body shrink-0"
          >
            <Plus className="size-4" />
            New Fee Type
          </Button>
        </div>

        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-body text-xs uppercase tracking-wide text-muted-foreground h-10">
                  Name
                </TableHead>
                <TableHead className="font-body text-xs uppercase tracking-wide text-muted-foreground h-10">
                  Description
                </TableHead>
                <TableHead className="font-body text-xs uppercase tracking-wide text-muted-foreground h-10">
                  Type
                </TableHead>
                <TableHead className="font-body text-xs uppercase tracking-wide text-muted-foreground h-10">
                  Status
                </TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : feeTypes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center font-body text-sm text-muted-foreground"
                  >
                    No fee types yet. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                feeTypes.map((ft) => (
                  <TableRow
                    key={ft.id}
                    className="border-border hover:bg-background"
                  >
                    <TableCell className="font-body font-medium text-foreground">
                      {ft.name}
                    </TableCell>
                    <TableCell className="font-body text-sm text-muted-foreground">
                      {ft.description || '—'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                          ft.isOptional
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-terracotta-pale text-primary',
                        )}
                      >
                        {ft.isOptional ? 'Optional' : 'Compulsory'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-terracotta-pale text-primary">
                        Active
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:bg-muted"
                          onClick={() => {
                            setEditingFeeType(ft);
                            setSheetOpen(true);
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:bg-red-50 text-muted-foreground hover:text-red-500"
                          onClick={() => setDeletingFeeType(ft)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <FeeTypeFormSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditingFeeType(null);
        }}
        feeType={editingFeeType}
      />

      <AlertDialog
        open={!!deletingFeeType}
        onOpenChange={(o) => !o && setDeletingFeeType(null)}
      >
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg text-foreground">
              Delete fee type
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm text-muted-foreground">
              This will permanently delete{' '}
              <span className="font-medium text-foreground">
                {deletingFeeType?.name}
              </span>
              . It cannot be deleted if it is used in any fee structure.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body border-border">
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={deleteFeeType.isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-body"
            >
              {deleteFeeType.isPending ? 'Deleting...' : 'Yes, delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
