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
import {
  useBanUser,
  useUnbanUser,
  useDeleteUser,
} from '@/hooks/admin/use-users';
import { useDebounce } from '@/hooks/use-debounce';
import type { Admin } from '@/types/profile';
import { CreateUserSheet } from '@/components/admin/create-user-sheet';
import { Pagination } from '@/components/Pagination';
import { useAdmins } from '@/hooks/admin/use-admin';
import { ConfirmDeleteDialog } from '../_components/ConfirmDeleteDialog';
import { SuspendDialog } from '../_components/SuspendDialog';
import { toast } from 'sonner';

export default function AdminsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);

  const ban = useBanUser(selectedAdmin?.user.id ?? '', 'admins');
  const unban = useUnbanUser(selectedAdmin?.user.id ?? '', 'admins');
  const deleteAdmin = useDeleteUser(adminToDelete?.user.id ?? '', 'admins');

  // Admins don't have a dedicated list endpoint — use /users filtered by role
  const { data, isLoading } = useAdmins({
    search: debouncedSearch,
    page,
    limit: 15,
  });

  const admins = data?.data ?? [];
  const meta = data?.meta;

  const columns: ColumnDef<Admin>[] = [
    {
      header: 'Admin',
      cell: ({ row }) => {
        const a = row.original;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-lg bg-terracotta-pale text-primary flex items-center justify-center text-xs font-body font-medium shrink-0">
              {a.user.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-body text-sm font-medium text-foreground truncate">
                {a.user.name}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {a.user.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Role',
      cell: ({ row }) => (
        <span className="font-body text-sm text-muted-foreground capitalize">
          {row.original.user.userRole?.replace('_', ' ')}
        </span>
      ),
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
          {row.original.user.banned ? 'Banned' : 'Active'}
        </span>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => {
        const admin = row.original;
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
                onClick={() => router.push(`/admin/users/admins/${admin.id}`)}
                className="font-body cursor-pointer"
              >
                <Eye className="size-4" />
                View profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setSelectedAdmin(admin)}
                className={cn(
                  'font-body cursor-pointer',
                  admin.user.banned
                    ? 'text-emerald-600 focus:text-emerald-600'
                    : 'text-amber-600 focus:text-amber-600',
                )}
              >
                {admin.user.banned ? (
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
                onClick={() => setAdminToDelete(admin)}
                className="font-body cursor-pointer text-red-600 focus:white"
              >
                <Trash2 className="size-4" />
                Delete Admin
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: admins,
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
              placeholder="Search admins..."
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
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body shrink-0"
          >
            <Plus className="size-4" />
            New Admin
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
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-border/30">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center font-body text-sm text-muted-foreground"
                >
                  No admins found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border/30 hover:bg-background cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/users/admins/${row.original.id}`)
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
        role="admin"
        onSuccess={(_, roleRecordId) => {
          if (roleRecordId) router.push(`/admin/admins/${roleRecordId}`);
        }}
        invalidateKey="admins"
      />

      <SuspendDialog
        open={!!selectedAdmin}
        entity="admin"
        name={selectedAdmin?.user.name ?? ''}
        isSuspended={selectedAdmin?.user.banned ?? false}
        isPending={ban.isPending || unban.isPending}
        onClose={() => setSelectedAdmin(null)}
        onConfirm={async (reason) => {
          if (selectedAdmin?.user.banned) {
            await unban.mutateAsync();
            toast.success('Admin suspension lifted');
          } else {
            await ban.mutateAsync({ reason });
            toast.success('Admin suspended');
          }
        }}
      />

      <ConfirmDeleteDialog
        open={!!adminToDelete}
        entity="admin"
        name={adminToDelete?.user.name ?? ''}
        isPending={deleteAdmin.isPending}
        onClose={() => setAdminToDelete(null)}
        onConfirm={async () => {
          await deleteAdmin.mutateAsync();
          toast.success('Admin deleted!');
        }}
      />
    </>
  );
}
