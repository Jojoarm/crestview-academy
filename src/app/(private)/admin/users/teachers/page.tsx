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
import { useTeachers } from '@/hooks/admin/use-teachers';
import {
  useBanUser,
  useUnbanUser,
  useDeleteUser,
} from '@/hooks/admin/use-users';
import { useDebounce } from '@/hooks/use-debounce';
import type { Teacher } from '@/types/profile';
import { CreateUserSheet } from '@/components/admin/create-user-sheet';
import { Pagination } from '@/components/Pagination';
import { ConfirmDeleteDialog } from '../_components/ConfirmDeleteDialog';
import { SuspendDialog } from '../_components/SuspendDialog';

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FullTime: 'Full Time',
  PartTime: 'Part Time',
  Contract: 'Contract',
};

export default function TeachersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const ban = useBanUser(selectedTeacher?.user.id ?? '', 'teachers');
  const unban = useUnbanUser(selectedTeacher?.user.id ?? '', 'teachers');
  const deleteTeacher = useDeleteUser(
    teacherToDelete?.user.id ?? '',
    'teachers',
  );

  const { data, isLoading } = useTeachers({
    search: debouncedSearch,
    page,
    limit: 15,
  });

  const teachers = data?.data ?? [];
  const meta = data?.meta;

  const columns: ColumnDef<Teacher>[] = [
    {
      header: 'Teacher',
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-body font-medium shrink-0">
              {t.user.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-body text-sm font-medium text-foreground truncate">
                {t.user.name}
              </p>
              <p className="font-body text-xs text-muted-foreground truncate">
                {t.user.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Employee ID',
      cell: ({ row }) => (
        <span className="font-body text-sm text-muted-foreground">
          {row.original.employeeId}
        </span>
      ),
    },
    {
      header: 'Designation',
      cell: ({ row }) => (
        <span className="font-body text-sm text-muted-foreground">
          {row.original.designation ?? '—'}
        </span>
      ),
    },
    {
      header: 'Employment',
      cell: ({ row }) => {
        const type = row.original.employmentType;
        return (
          <span className="font-body text-sm text-muted-foreground">
            {type ? EMPLOYMENT_TYPE_LABELS[type] : '—'}
          </span>
        );
      },
    },
    {
      header: 'Status',
      cell: ({ row }) => {
        const banned = row.original.user.banned;
        return (
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
              banned
                ? 'bg-red-50 text-red-600'
                : 'bg-emerald-50 text-emerald-700',
            )}
          >
            {banned ? 'Banned' : 'Active'}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => {
        const teacher = row.original;
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
                  router.push(`/admin/users/teachers/${teacher.id}`)
                }
                className="font-body cursor-pointer"
              >
                <Eye className="size-4" />
                View profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setSelectedTeacher(teacher)}
                className={cn(
                  'font-body cursor-pointer',
                  teacher.user.banned
                    ? 'text-emerald-600 focus:text-emerald-600'
                    : 'text-amber-600 focus:text-amber-600',
                )}
              >
                {teacher.user.banned ? (
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
                onClick={() => setTeacherToDelete(teacher)}
                className="font-body cursor-pointer text-red-600 focus:white"
              >
                <Trash2 className="size-4" />
                Delete Teacher
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: teachers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card className="p-4">
        <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-border/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search teachers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 border-border font-body text-sm"
            />
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body shrink-0 cursor-pointer"
          >
            <Plus className="size-4" />
            New Teacher
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
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center font-body text-sm text-muted-foreground"
                >
                  No teachers found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border/30 hover:bg-background cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/users/teachers/${row.original.id}`)
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
        role="teacher"
        onSuccess={(_, roleRecordId) => {
          if (roleRecordId)
            router.push(`/admin/users/teachers/${roleRecordId}`);
        }}
        invalidateKey="teachers"
      />

      <SuspendDialog
        open={!!selectedTeacher}
        entity="teacher"
        name={selectedTeacher?.user.name ?? ''}
        isSuspended={selectedTeacher?.user.banned ?? false}
        isPending={ban.isPending || unban.isPending}
        onClose={() => setSelectedTeacher(null)}
        onConfirm={async (reason) => {
          if (selectedTeacher?.user.banned) {
            await unban.mutateAsync();
            toast.success('Teacher suspension lifted');
          } else {
            await ban.mutateAsync({ reason });
            toast.success('Teacher suspended');
          }
        }}
      />

      <ConfirmDeleteDialog
        open={!!teacherToDelete}
        entity="teacher"
        name={teacherToDelete?.user.name ?? ''}
        isPending={deleteTeacher.isPending}
        onClose={() => setTeacherToDelete(null)}
        onConfirm={async () => {
          await deleteTeacher.mutateAsync();
          toast.success('Teacher deleted!');
        }}
      />
    </>
  );
}
