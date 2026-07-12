// src/app/(private)/admin/students/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Eye,
  Ban,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
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
import { useStudents } from '@/hooks/admin/use-students';
import {
  useBanUser,
  useDeleteUser,
  useUnbanUser,
} from '@/hooks/admin/use-users';
import { useDebounce } from '@/hooks/use-debounce';
import { SECTIONS, type Section } from '@/types/class';
import type { Student } from '@/types/profile';
import { CreateUserSheet } from '@/components/admin/create-user-sheet';
import { Pagination } from '@/components/Pagination';
import { SuspendDialog } from '../_components/SuspendDialog';
import { ConfirmDeleteDialog } from '../_components/ConfirmDeleteDialog';

export default function StudentsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [section, setSection] = useState<Section | ''>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const ban = useBanUser(selectedStudent?.user.id ?? '', 'students');
  const unban = useUnbanUser(selectedStudent?.user.id ?? '', 'students');
  const deleteStudent = useDeleteUser(
    studentToDelete?.user.id ?? '',
    'students',
  );

  const [createOpen, setCreateOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useStudents({
    search: debouncedSearch,
    section,
    page,
    limit: 15,
  });

  const students = data?.data ?? [];
  const meta = data?.meta;

  const columns: ColumnDef<Student>[] = [
    {
      header: 'Student',
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-full bg-violet/10 text-violet flex items-center justify-center text-xs font-body font-medium shrink-0">
              {s.user.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-body text-sm font-medium text-foreground truncate">
                {s.user.name}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {s.user.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Admission No',
      cell: ({ row }) => (
        <span className="font-body text-sm text-muted-foreground">
          {row.original.admissionNumber}
        </span>
      ),
    },
    {
      header: 'Class',
      cell: ({ row }) => {
        const active = row.original.enrollments?.find((e) => e.isActive);
        if (!active)
          return (
            <span className="font-body text-xs text-muted-foreground">
              Not enrolled
            </span>
          );
        return (
          <span className="font-body text-sm text-foreground">
            {active.classArm.classLevel.name} (Arm {active.classArm.arm.name})
          </span>
        );
      },
    },
    {
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
            row.original.user.banned
              ? 'bg-red-50 text-red-600'
              : 'bg-emerald-50 text-emerald-700',
          )}
        >
          {row.original.user.banned ? 'Suspended' : 'Active'}
        </span>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => {
        const student = row.original;
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
                onClick={() =>
                  router.push(`/admin/users/students/${student.id}`)
                }
                className="font-body cursor-pointer"
              >
                <Eye className="size-4" />
                View profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setSelectedStudent(student)}
                className={cn(
                  'font-body cursor-pointer',
                  student.user.banned
                    ? 'text-emerald-600 focus:text-emerald-600'
                    : 'text-amber-600 focus:text-amber-600',
                )}
              >
                {student.user.banned ? (
                  <>
                    <ShieldCheck className="size-4" />
                    Lift Suspension
                  </>
                ) : (
                  <>
                    <Ban className="size-4" />
                    Suspend
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setStudentToDelete(student)}
                className="font-body cursor-pointer text-red-600 focus:white"
              >
                <Trash2 className="size-4" />
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card className="p-4">
        <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-border/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
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
              onValueChange={(v) => {
                setSection(v === 'all' ? '' : (v as Section));
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
            onClick={() => setCreateOpen(true)}
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body shrink-0"
          >
            <Plus className="size-4" />
            New Student
          </Button>
        </div>

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
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center font-body text-sm text-muted-foreground"
                >
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border/30 hover:bg-background cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/users/students/${row.original.id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3"
                      onClick={
                        cell.column.id === 'actions'
                          ? (e) => e.stopPropagation()
                          : undefined
                      }
                    >
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

      <CreateUserSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        role="student"
        onSuccess={(_, roleRecordId) => {
          if (roleRecordId) router.push(`/admin/students/${roleRecordId}`);
        }}
        invalidateKey="students"
      />

      <SuspendDialog
        open={!!selectedStudent}
        entity="student"
        name={selectedStudent?.user.name ?? ''}
        isSuspended={selectedStudent?.user.banned ?? false}
        isPending={ban.isPending || unban.isPending}
        onClose={() => setSelectedStudent(null)}
        onConfirm={async (reason) => {
          if (selectedStudent?.user.banned) {
            await unban.mutateAsync();
            toast.success('Student suspension lifted');
          } else {
            await ban.mutateAsync({ reason });
            toast.success('Student suspended');
          }
        }}
      />

      <ConfirmDeleteDialog
        open={!!studentToDelete}
        entity="student"
        name={studentToDelete?.user.name ?? ''}
        isPending={deleteStudent.isPending}
        onClose={() => setStudentToDelete(null)}
        onConfirm={async () => {
          await deleteStudent.mutateAsync();
          toast.success('Student deleted!');
        }}
      />
    </>
  );
}
