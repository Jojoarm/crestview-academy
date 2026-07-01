// src/app/(private)/admin/users/_components/columns.tsx

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Ban, Trash2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { User } from '@/types/user';
import { USER_ROLE_CONFIG } from '@/types/user';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

type Actions = {
  onEdit: (user: User) => void;
  onBan: (user: User) => void;
  onDelete: (user: User) => void;
};

export function createColumns({
  onEdit,
  onBan,
  onDelete,
}: Actions): ColumnDef<User>[] {
  return [
    {
      id: 'user',
      accessorFn: (row) => `${row.name} ${row.email}`,
      header: 'User Details',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-full bg-foreground text-white flex items-center justify-center text-xs font-body font-medium shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="font-body text-sm font-medium text-(--charcoal) truncate">
                {user.name}
              </p>
              <p className="font-body text-xs text-(--charcoal-100) truncate">
                {user.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'userRole',
      header: 'Role',
      cell: ({ row }) => {
        const config = USER_ROLE_CONFIG[row.original.userRole];
        return (
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-body font-medium',
              config.className,
            )}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      accessorKey: 'banned',
      header: 'Status',
      cell: ({ row }) => {
        const banned = row.original.banned;
        return (
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-body font-medium',
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
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => (
        <span className="font-body text-sm text-(--charcoal-100)">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:bg-(--warm-white-dark)"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-(--warm-white) border-(--border-sand) shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => onEdit(user)}
                className="font-body cursor-pointer"
              >
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBan(user)}
                className={cn(
                  'font-body cursor-pointer',
                  user.banned
                    ? 'text-emerald-600 focus:text-emerald-600'
                    : 'text-amber-600 focus:text-amber-600',
                )}
              >
                {user.banned ? (
                  <>
                    <ShieldCheck className="size-4" />
                    Unban
                  </>
                ) : (
                  <>
                    <Ban className="size-4" />
                    Ban
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(user)}
                className="font-body cursor-pointer text-red-600 focus:text-red-600"
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
}
