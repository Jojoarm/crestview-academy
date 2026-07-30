'use client';

import { useState } from 'react';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Users,
  X,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useRemoveClassArm } from '@/hooks/admin/use-classes';
import { ApiError } from '@/lib/api-client';
import type { ClassLevel, ClassArm } from '@/types/class';
import { AssignArmSheet } from './assign-arm-sheet';
import { DeleteClassDialog } from './delete-class-dialog';
import { useRouter } from 'next/navigation';

type Props = {
  classLevel: ClassLevel;
  onEdit: (classLevel: ClassLevel) => void;
};

const SECTION_COLORS: Record<string, string> = {
  Nursery: 'bg-violet/10 text-violet',
  Kindergarten: 'bg-ember/10 text-ember',
  Primary: 'bg-deep-violet/10 text-deep-violet',
  Secondary: 'bg-sage-light/20 text-foreground-100',
};

export function ClassCard({ classLevel, onEdit }: Props) {
  const router = useRouter();
  const [assignSheetOpen, setAssignSheetOpen] = useState(false);
  const [editingArm, setEditingArm] = useState<ClassArm | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const removeArm = useRemoveClassArm(classLevel.id);

  async function handleRemoveArm(armId: string, armName: string) {
    try {
      await removeArm.mutateAsync(armId);
      toast.success(`Arm ${armName} removed`);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to remove arm',
      );
    }
  }
  return (
    <>
      <Card className="p-5 flex flex-col gap-4 relative overflow-hidden group">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-sans font-medium text-lg text-foreground truncate">
                {classLevel.name}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                  SECTION_COLORS[classLevel.section] ??
                    'bg-muted text-muted-foreground',
                )}
              >
                {classLevel.section}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                  classLevel.isActive
                    ? 'bg-terracotta-pale text-primary'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {classLevel.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:bg-muted shrink-0"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Class actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background border-border shadow-lg w-42"
            >
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/academics/classes/${classLevel.id}`)
                }
                className="font-body cursor-pointer"
              >
                <Eye className="size-4 text-violet" />
                View class details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onEdit(classLevel)}
                className="font-body cursor-pointer"
              >
                <Pencil className="size-4" />
                Edit class
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="font-body cursor-pointer text-red-600 focus:text-white"
              >
                <Trash2 className="size-4" />
                Delete class
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border" />

        {/* Arms */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-3.5" />
              <span className="font-body text-xs uppercase tracking-wide font-medium">
                Arms
              </span>
              {classLevel.totalCapacity > 0 && (
                <span className="font-body text-xs text-muted-foreground">
                  · {classLevel.totalCapacity} total capacity
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingArm(null);
                setAssignSheetOpen(true);
              }}
              className="h-7 text-xs font-body text-primary hover:bg-terracotta-pale hover:text-primary gap-1"
            >
              <Plus className="size-3" />
              Assign arm
            </Button>
          </div>

          {classLevel.classArms.length === 0 ? (
            <p className="font-body text-xs text-muted-foreground py-1">
              No arms assigned yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {classLevel.classArms.map((ca) => (
                <div
                  key={ca.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border rounded group/arm"
                >
                  <button
                    onClick={() => {
                      setEditingArm(ca);
                      setAssignSheetOpen(true);
                    }}
                    className="font-body text-xs font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {ca.arm.name}
                    <span className="text-muted-foreground font-normal ml-1">
                      ({ca.capacity})
                    </span>
                  </button>
                  <button
                    onClick={() => handleRemoveArm(ca.armId, ca.arm.name)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X className="size-3" />
                    <span className="sr-only">Remove arm {ca.arm.name}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <AssignArmSheet
        open={assignSheetOpen}
        onOpenChange={(open) => {
          setAssignSheetOpen(open);
          if (!open) setEditingArm(null);
        }}
        classLevel={classLevel}
        editingArm={editingArm}
      />

      <DeleteClassDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        classLevel={classLevel}
      />
    </>
  );
}
