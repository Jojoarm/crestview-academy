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
import {
  usePeriodSlots,
  useDeletePeriodSlot,
} from '@/hooks/admin/use-timetable';
import { ApiError } from '@/lib/api-client';
import { SECTIONS, type Section } from '@/types/class';
import type { PeriodSlot } from '@/types/timetable';
import { PeriodSlotFormSheet } from './period-slot-form-sheet';

export function PeriodSlotsTab() {
  const [section, setSection] = useState<Section>('Primary');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<PeriodSlot | null>(null);
  const [deletingSlot, setDeletingSlot] = useState<PeriodSlot | null>(null);

  const { data: slots, isLoading } = usePeriodSlots(section);
  const deleteSlot = useDeletePeriodSlot(deletingSlot?.id ?? '');

  async function handleDelete() {
    try {
      await deleteSlot.mutateAsync();
      toast.success('Period slot deleted');
      setDeletingSlot(null);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Failed to delete period slot',
      );
    }
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-semibold text-lg text-foreground">
              Period Slots
            </h2>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              Configure periods and breaks per section
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingSlot(null);
              setSheetOpen(true);
            }}
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body shrink-0"
          >
            <Plus className="size-4" />
            New Slot
          </Button>
        </div>

        {/* Section filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-body font-medium transition-colors',
                section === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-background-100',
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-body text-xs uppercase tracking-wide text-muted-foreground h-10 w-8">
                  #
                </TableHead>
                <TableHead className="font-body text-xs uppercase tracking-wide text-muted-foreground h-10">
                  Name
                </TableHead>
                <TableHead className="font-body text-xs uppercase tracking-wide text-muted-foreground h-10">
                  Time
                </TableHead>
                <TableHead className="font-body text-xs uppercase tracking-wide text-muted-foreground h-10">
                  Type
                </TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : !slots || slots.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center font-body text-sm text-muted-foreground"
                  >
                    No period slots for {section}. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                slots.map((slot) => (
                  <TableRow
                    key={slot.id}
                    className={cn(
                      'border-border hover:bg-background',
                      slot.isBreak && 'bg-muted/50',
                    )}
                  >
                    <TableCell className="font-body text-sm text-muted-foreground">
                      {slot.order}
                    </TableCell>
                    <TableCell className="font-body text-sm font-medium text-foreground">
                      {slot.name}
                    </TableCell>
                    <TableCell className="font-body text-sm text-muted-foreground">
                      {slot.startTime} — {slot.endTime}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                          slot.isBreak
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-terracotta-pale text-primary',
                        )}
                      >
                        {slot.isBreak ? 'Break' : 'Period'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:bg-muted"
                          onClick={() => {
                            setEditingSlot(slot);
                            setSheetOpen(true);
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:bg-red-50 text-muted-foreground hover:text-red-500"
                          onClick={() => setDeletingSlot(slot)}
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

      <PeriodSlotFormSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditingSlot(null);
        }}
        slot={editingSlot}
        defaultSection={section}
      />

      <AlertDialog
        open={!!deletingSlot}
        onOpenChange={(o) => !o && setDeletingSlot(null)}
      >
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-lg text-foreground">
              Delete period slot
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm text-muted-foreground">
              This will permanently delete{' '}
              <span className="font-medium text-foreground">
                {deletingSlot?.name}
              </span>
              . It cannot be deleted if it is used in any timetable entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body border-border">
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={deleteSlot.isPending}
              className="bg-red-600 hover:bg-red-700 text-white font-body"
            >
              {deleteSlot.isPending ? 'Deleting...' : 'Yes, delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
