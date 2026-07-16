'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Pagination } from '@/components/Pagination';

import {
  ATTENDANCE_STATUS_COLORS,
  ATTENDANCE_STATUSES,
  cn,
  formatDate,
} from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import {
  useAttendance,
  useUpdateAttendanceRecord,
} from '@/hooks/teacher/use-attendance';
import { AttendanceRecord, AttendanceStatus } from '@/types/teacher/attendance';

function StatusCell({ record }: { record: AttendanceRecord }) {
  const updateRecord = useUpdateAttendanceRecord();

  async function handleChange(status: AttendanceStatus) {
    if (status === record.status) return;
    try {
      await updateRecord.mutateAsync({ id: record.id, status });
      toast.success('Attendance updated');
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to update record',
      );
    }
  }

  return (
    <Select
      value={record.status}
      onValueChange={(v) => handleChange(v as AttendanceStatus)}
    >
      <SelectTrigger
        className={cn(
          'h-7 w-28 border-0 text-xs font-body font-medium',
          ATTENDANCE_STATUS_COLORS[record.status],
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-background border-border shadow-lg">
        {ATTENDANCE_STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="font-body">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface AttendanceHistoryPanelProps {
  classArmId: string;
}

export function AttendanceHistoryPanel({
  classArmId,
}: AttendanceHistoryPanelProps) {
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAttendance({
    classArmId,
    date: date || undefined,
    page,
    limit: 20,
  });

  const records = data?.data ?? [];
  const meta = data?.meta;

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      header: 'Student',
      cell: ({ row }) => (
        <span className="font-body text-sm font-medium text-foreground">
          {row.original.student.user.name}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: ({ row }) => (
        <span className="font-body text-xs text-muted-foreground">
          {formatDate(row.original.date)}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: ({ row }) => <StatusCell record={row.original} />,
    },
    {
      header: 'Marked by',
      cell: ({ row }) => (
        <span className="font-body text-xs text-muted-foreground">
          {row.original.markedBy.user.name}
        </span>
      ),
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-border/30 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setPage(1);
            }}
            className="h-9 w-40 border-border font-body text-sm"
          />
          {date && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDate('');
                setPage(1);
              }}
              className="h-9 font-body text-xs"
            >
              Clear
            </Button>
          )}
        </div>
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
                {Array.from({ length: 4 }).map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : records.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center font-body text-sm text-muted-foreground"
              >
                No attendance records found.
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  );
}
