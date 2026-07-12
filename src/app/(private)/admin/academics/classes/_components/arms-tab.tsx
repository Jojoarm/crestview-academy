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
import { useArms, useDeleteArm } from '@/hooks/admin/use-classes';
import { ApiError } from '@/lib/api-client';
import type { Arm } from '@/types/class';
import { ArmFormSheet } from './arm-form-sheet';

export function ArmsTab() {
  const { data, isLoading } = useArms();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingArm, setEditingArm] = useState<Arm | null>(null);
  const [deletingArm, setDeletingArm] = useState<Arm | null>(null);

  const arms = data?.data ?? [];
  const deleteArm = useDeleteArm(deletingArm?.id ?? '');

  async function handleDelete() {
    try {
      await deleteArm.mutateAsync();
      toast.success(`Arm "${deletingArm?.name}" deleted`);
      setDeletingArm(null);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to delete arm',
      );
    }
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-semibold text-lg text-foreground">
              Arms
            </h2>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              School-wide arms shared across all classes
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingArm(null);
              setSheetOpen(true);
            }}
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body shrink-0"
          >
            <Plus className="size-4" />
            New Arm
          </Button>
        </div>

        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-body text-xs uppercase tracking-wide text-muted-foreground h-10">
                  Arm name
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
                    {Array.from({ length: 3 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : !arms || arms.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center font-body text-sm text-muted-foreground"
                  >
                    No arms yet. Create one to assign to classes.
                  </TableCell>
                </TableRow>
              ) : (
                arms.map((arm) => (
                  <TableRow
                    key={arm.id}
                    className="border-border hover:bg-background"
                  >
                    <TableCell className="font-body font-medium text-foreground">
                      Arm {arm.name}
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
                            setEditingArm(arm);
                            setSheetOpen(true);
                          }}
                        >
                          <Pencil className="size-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:bg-red-50 text-red-500"
                          onClick={() => setDeletingArm(arm)}
                        >
                          <Trash2 className="size-3.5" />
                          <span className="sr-only">Delete</span>
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

      <ArmFormSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditingArm(null);
        }}
        arm={editingArm}
      />

      <AlertDialog
        open={!!deletingArm}
        onOpenChange={(o) => !o && setDeletingArm(null)}
      >
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg text-foreground">
              Delete arm
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm text-muted-foreground">
              This will permanently delete Arm{' '}
              <span className="font-medium text-foreground">
                {deletingArm?.name}
              </span>
              . It cannot be deleted if it is currently assigned to any class.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body border-border">
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={deleteArm.isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-body"
            >
              {deleteArm.isPending ? 'Deleting...' : 'Yes, delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
