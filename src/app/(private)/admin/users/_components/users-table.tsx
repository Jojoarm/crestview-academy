'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { User } from '@/types/user';
import type { UserRole } from '@/lib/roles';
import { createColumns } from './columns';
import { useUsers } from '@/hooks/admin/use-users';
import { UserFormSheet } from './user-form-sheet';
import { BanUserDialog } from './ban-user-dialog';
import { DeleteUserDialog } from './delete-user-dialog';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/Pagination';
import { useDebounce } from '@/hooks/use-debounce';

const ALL_ROLES = '__all__';

const ROLE_OPTIONS = [
  { label: 'All Roles', value: ALL_ROLES },
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Teacher', value: 'teacher' },
  { label: 'Parent', value: 'parent' },
  { label: 'Student', value: 'student' },
] as const;

export function UsersTable() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<UserRole | ''>('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [banUser, setBanUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const { data, isLoading } = useUsers({
    page,
    limit: 10,
    role,
    search: debouncedSearch,
  });

  const columns = createColumns({
    onEdit: (user) => {
      setEditingUser(user);
      setSheetOpen(true);
    },
    onBan: (user) => setBanUser(user),
    onDelete: (user) => setDeleteUser(user),
  });

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
        <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-(--border-sand)/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--charcoal-100)" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 border-(--border-sand)/20 font-body text-sm"
              />
            </div>
            <Select
              value={role || ALL_ROLES}
              onValueChange={(value) => {
                setRole(value === ALL_ROLES ? '' : (value as UserRole));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-36 h-9 border-(--border-sand)/30 focus:ring-terracotta font-body text-sm">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="bg-(--warm-white) border-(--border-sand) shadow-lg">
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.label}
                    value={opt.value}
                    className="font-body"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => {
              setEditingUser(null);
              setSheetOpen(true);
            }}
            className="h-9 bg-terracotta hover:bg-(--terracotta-mid) text-white font-body shrink-0"
          >
            <Plus className="size-4" />
            New User
          </Button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-(--border-sand)/30 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-body font-semibold text-xs capitalize tracking-wide text-(--charcoal-100) h-10"
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
                <TableRow key={i} className="border-(--border-sand)/30">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-(--warm-white-dark) animate-pulse rounded w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center font-body text-sm text-(--charcoal-100)"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-(--border-sand)/30 hover:bg-(--warm-white)"
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

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={setPage}
          />
        )}
      </Card>

      <UserFormSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditingUser(null);
        }}
        user={editingUser}
      />

      <BanUserDialog user={banUser} onClose={() => setBanUser(null)} />

      <DeleteUserDialog user={deleteUser} onClose={() => setDeleteUser(null)} />
    </>
  );
}
