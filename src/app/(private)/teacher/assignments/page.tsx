'use client';

import { useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useTeacherSubjects } from '@/hooks/teacher/use-subjects';
import {
  useAssignments,
  useDeleteAssignment,
} from '@/hooks/teacher/use-assignments';
import type { Assignment } from '@/types/teacher/assignment';
import { Pagination } from '@/components/Pagination';
import { AssignmentFormSheet } from './_components/assignment-form-sheet';
import { ConfirmDeleteDialog } from '../../admin/users/_components/ConfirmDeleteDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatClassArmLabel } from '@/lib/utils';

export default function TeacherAssignmentsPage() {
  //   const router = useRouter();
  const [page, setPage] = useState(1);
  const [classArmId, setClassArmId] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<
    Assignment | undefined
  >();
  const [deletingAssignment, setDeletingAssignment] =
    useState<Assignment | null>(null);

  const { data: subjectAssignments } = useTeacherSubjects();

  const classArmOptions = useMemo(() => {
    if (!subjectAssignments) return [];
    const seen = new Set<string>();
    return subjectAssignments.filter((sa) => {
      if (seen.has(sa.classArmId)) return false;
      seen.add(sa.classArmId);
      return true;
    });
  }, [subjectAssignments]);

  const subjectOptions = useMemo(() => {
    if (!subjectAssignments) return [];
    const seen = new Set<string>();
    return subjectAssignments.filter((sa) => {
      if (classArmId && sa.classArmId !== classArmId) return false;
      if (seen.has(sa.subjectId)) return false;
      seen.add(sa.subjectId);
      return true;
    });
  }, [subjectAssignments, classArmId]);

  const { data, isLoading } = useAssignments({
    classArmId: classArmId || undefined,
    subjectId: subjectId || undefined,
    page,
    limit: 20,
  });

  const deleteAssignment = useDeleteAssignment();

  const assignments = data?.data ?? [];
  const meta = data?.meta;

  function openCreate() {
    setEditingAssignment(undefined);
    setSheetOpen(true);
  }

  function openEdit(assignment: Assignment, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingAssignment(assignment);
    setSheetOpen(true);
  }

  function openDelete(assignment: Assignment, e: React.MouseEvent) {
    e.stopPropagation();
    setDeletingAssignment(assignment);
  }

  async function confirmDelete() {
    if (!deletingAssignment) return;
    await deleteAssignment.mutateAsync(deletingAssignment.id);
    setDeletingAssignment(null);
  }

  const columns: ColumnDef<Assignment>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.original.title}</div>
      ),
    },
    {
      id: 'class',
      header: 'Class',
      cell: ({ row }) => formatClassArmLabel(row.original.classArm),
    },
    {
      id: 'subject',
      header: 'Subject',
      cell: ({ row }) => row.original.subject.name,
    },
    {
      accessorKey: 'dueDate',
      header: 'Due date',
      cell: ({ row }) =>
        new Date(row.original.dueDate).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant={row.original.isPublished ? 'default' : 'secondary'}
          className={
            row.original.isPublished
              ? 'bg-violet text-light-violet'
              : 'bg-terracotta-pale text-primary'
          }
        >
          {row.original.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    // {
    //   id: 'submissions',
    //   header: 'Submissions',
    //   cell: ({ row }) => row.original._count.submissions,
    // },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:bg-muted"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background border-border shadow-lg"
            >
              <DropdownMenuItem
                onClick={(e) => openEdit(row.original, e)}
                className="font-body cursor-pointer"
              >
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => openDelete(row.original, e)}
                className="font-body cursor-pointer text-red-600 focus:text-white"
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: assignments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-semibold text-2xl text-foreground">
            Assignments
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage assignments for the classes you teach.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          New Assignment
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={classArmId || 'all'}
          onValueChange={(v) => {
            setClassArmId(v === 'all' ? '' : v);
            setSubjectId('');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-45 border-border h-10">
            <SelectValue placeholder="All classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {classArmOptions.map((sa) => (
              <SelectItem key={sa.classArmId} value={sa.classArmId}>
                {formatClassArmLabel(sa.classArm)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={subjectId || 'all'}
          onValueChange={(v) => {
            setSubjectId(v === 'all' ? '' : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-45 border-border h-10">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjectOptions.map((sa) => (
              <SelectItem key={sa.subjectId} value={sa.subjectId}>
                {sa.subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow
                key={hg.id}
                className="border-border/30 hover:bg-transparent"
              >
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-body font-semibold text-xs capitalize tracking-wide text-muted-foreground h-10"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="border-border/30">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : assignments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No assignments yet. Create your first one to get started.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border/30 hover:bg-background"
                  //   className="cursor-pointer"
                  //   onClick={() =>
                  //     router.push(`/teacher/assignments/${row.original.id}`)
                  //   }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && (
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={setPage}
        />
      )}

      <AssignmentFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        assignment={editingAssignment}
      />

      <ConfirmDeleteDialog
        open={!!deletingAssignment}
        entity="assignment"
        name={deletingAssignment?.title ?? ''}
        onClose={() => setDeletingAssignment(null)}
        onConfirm={confirmDelete}
        isPending={deleteAssignment.isPending}
      />
    </div>
  );
}
