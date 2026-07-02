'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useSubjects } from '@/hooks/admin/use-subjects';
import { useDebounce } from '@/hooks/use-debounce';
import { SECTIONS, type Section } from '@/types/class';
import type { Subject } from '@/types/subject';
import { SubjectFormSheet } from './subject-form-sheet';
import { ManageAssignmentsSheet } from './manage-assignments-sheet';
import { DeleteSubjectDialog } from './delete-subject-dialog';
import { Pagination } from '@/components/Pagination';

export function SubjectsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [section, setSection] = useState<Section | ''>('');
  const debouncedSearch = useDebounce(search, 500);

  const [formSheetOpen, setFormSheetOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [assignmentsSubjectId, setAssignmentsSubjectId] = useState<
    string | null
  >(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  const { data, isLoading } = useSubjects({
    search: debouncedSearch,
    section,
    page,
    limit: 15,
  });

  const columns: ColumnDef<Subject>[] = [
    {
      header: 'Subject',
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-full bg-terracotta-pale text-primary flex items-center justify-center shrink-0">
              <span className="font-body text-xs font-medium">
                {row.index + 1}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-body text-sm font-medium text-foreground truncate">
                {s.name}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {s.code}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Description',
      cell: ({ row }) => (
        <p className="font-body text-sm text-muted-foreground truncate max-w-48">
          {row.original.description || '—'}
        </p>
      ),
    },
    {
      header: 'Classes',
      cell: ({ row }) => {
        const count = row.original.classAssignments.length;
        return (
          <button
            onClick={() => setAssignmentsSubjectId(row.original.id)}
            className="font-body text-sm text-deep-violet hover:underline"
          >
            {count} {count === 1 ? 'class' : 'classes'}
          </button>
        );
      },
    },
    {
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
            row.original.isActive
              ? 'bg-light-violet text-violet'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => {
        const subject = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:bg-muted"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background border-border shadow-lg rounded-xl w-46 p-2"
            >
              <DropdownMenuItem
                onClick={() => {
                  setAssignmentsSubjectId(subject.id);
                  setFormSheetOpen(true);
                }}
                className="font-body cursor-pointer"
              >
                <Pencil className="size-4" />
                Edit subject
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAssignmentsSubjectId(subject.id)}
                className="font-body cursor-pointer"
              >
                <BookOpen className="size-4" />
                Manage classes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingSubject(subject)}
                className="font-body cursor-pointer text-red-600 focus:white"
              >
                <Trash2 className="size-4" />
                Delete subject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const meta = data?.meta;

  return (
    <>
      <Card className="p-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-border/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 border-border font-body text-sm"
              />
            </div>
            <Select
              value={section || 'all'}
              onValueChange={(val) => {
                setSection(val === 'all' ? '' : (val as Section));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-36 h-9 border-border font-body text-sm">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg">
                <SelectItem value="all" className="font-body">
                  All Sections
                </SelectItem>
                {SECTIONS.map((s) => (
                  <SelectItem key={s} value={s} className="font-body">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => {
              setEditingSubject(null);
              setFormSheetOpen(true);
            }}
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body shrink-0"
          >
            <Plus className="size-4" />
            New Subject
          </Button>
        </div>

        {/* Table */}
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
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center font-body text-sm text-muted-foreground"
                >
                  No subjects found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border/30 hover:bg-background"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
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

        {meta && (
          <Pagination
            page={page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={setPage}
          />
        )}
      </Card>

      <SubjectFormSheet
        open={formSheetOpen}
        onOpenChange={(open) => {
          setFormSheetOpen(open);
          if (!open) setEditingSubject(null);
        }}
        subject={editingSubject}
      />

      <ManageAssignmentsSheet
        subjectId={assignmentsSubjectId}
        onClose={() => setAssignmentsSubjectId(null)}
      />

      <DeleteSubjectDialog
        subject={deletingSubject}
        onClose={() => setDeletingSubject(null)}
      />
    </>
  );
}
