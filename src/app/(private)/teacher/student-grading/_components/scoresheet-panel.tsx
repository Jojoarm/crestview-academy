'use client';

import { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { Check, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
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
import { Pagination } from '@/components/Pagination';

import { cn } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { useScores, useUpdateScore } from '@/hooks/teacher/use-scores';
import {
  GRADE_COLORS,
  GRADE_SCALE,
  type ScoreListItem,
  type SubjectOption,
} from '@/types/teacher/score';

interface ScoresheetPanelProps {
  classArmId: string;
  subjectOptions: SubjectOption[];
  sessionId: string;
  termId: string;
}

export function ScoresheetPanel({
  classArmId,
  subjectOptions,
  sessionId,
  termId,
}: ScoresheetPanelProps) {
  const [subjectId, setSubjectId] = useState(
    subjectOptions[0]?.subjectId ?? '',
  );
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ caScore: '', examScore: '' });

  useEffect(() => {
    if (!subjectOptions.some((s) => s.subjectId === subjectId)) {
      setSubjectId(subjectOptions[0]?.subjectId ?? '');
    }
    setPage(1);
    setEditingId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classArmId, subjectOptions, sessionId, termId]);

  const { data, isLoading } = useScores({
    classArmId,
    subjectId: subjectId || undefined,
    sessionId,
    termId,
    page,
    limit: 20,
  });

  const updateScore = useUpdateScore();

  const scores = data?.data ?? [];
  const meta = data?.meta;

  function startEdit(score: ScoreListItem) {
    setEditingId(score.id);
    setEditDraft({ caScore: score.caScore, examScore: score.examScore });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    const caScore = Number(editDraft.caScore);
    const examScore = Number(editDraft.examScore);
    if (Number.isNaN(caScore) || Number.isNaN(examScore)) {
      toast.error('Enter valid numbers for both scores');
      return;
    }
    try {
      await updateScore.mutateAsync({ id, input: { caScore, examScore } });
      toast.success('Score updated');
      setEditingId(null);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'Failed to update score',
      );
    }
  }

  const columns: ColumnDef<ScoreListItem>[] = [
    {
      header: 'Student',
      cell: ({ row }) => (
        <span className="font-body text-sm font-medium text-foreground">
          {row.original.student.user.name}
        </span>
      ),
    },
    {
      header: 'CA',
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <Input
            type="number"
            min={0}
            step="0.5"
            value={editDraft.caScore}
            onChange={(e) =>
              setEditDraft((d) => ({ ...d, caScore: e.target.value }))
            }
            className="h-8 w-20 border-border font-body text-sm"
          />
        ) : (
          <span className="font-body text-sm text-foreground tabular-nums">
            {parseFloat(row.original.caScore)}
          </span>
        ),
    },
    {
      header: 'Exam',
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <Input
            type="number"
            min={0}
            step="0.5"
            value={editDraft.examScore}
            onChange={(e) =>
              setEditDraft((d) => ({ ...d, examScore: e.target.value }))
            }
            className="h-8 w-20 border-border font-body text-sm"
          />
        ) : (
          <span className="font-body text-sm text-foreground tabular-nums">
            {parseFloat(row.original.examScore)}
          </span>
        ),
    },
    {
      header: 'Total',
      cell: ({ row }) => (
        <span className="font-body text-sm font-medium text-foreground tabular-nums">
          {parseFloat(row.original.total)}
        </span>
      ),
    },
    {
      header: 'Grade',
      cell: ({ row }) => (
        <span
          className={cn(
            'inline-flex items-center justify-center size-6 rounded text-xs font-body font-semibold',
            GRADE_COLORS[row.original.grade],
          )}
        >
          {row.original.grade}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) =>
        editingId === row.original.id ? (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={() => saveEdit(row.original.id)}
              disabled={updateScore.isPending}
            >
              <Check className="size-4 text-emerald-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={cancelEdit}
              disabled={updateScore.isPending}
            >
              <X className="size-4 text-muted-foreground" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => startEdit(row.original)}
          >
            <Pencil className="size-4" />
          </Button>
        ),
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: scores,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-border/30 sm:flex-row sm:items-center sm:justify-between">
        <Select value={subjectId} onValueChange={setSubjectId}>
          <SelectTrigger className="w-56 h-9 border-border font-body text-sm">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border shadow-lg">
            {subjectOptions.map((s) => (
              <SelectItem
                key={s.subjectId}
                value={s.subjectId}
                className="font-body"
              >
                {s.name} ({s.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap items-center gap-2">
          {GRADE_SCALE.map((g) => (
            <div
              key={g.grade}
              className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs"
            >
              <span className="font-semibold text-foreground">{g.grade}</span>
              <span className="text-muted-foreground">{g.range}</span>
            </div>
          ))}
        </div>
      </div>

      {subjectOptions.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          There are no subjects available to view in this class arm yet.
        </p>
      ) : (
        <>
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
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : scores.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center font-body text-sm text-muted-foreground"
                  >
                    No scores recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border/30 hover:bg-background"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
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
        </>
      )}
    </Card>
  );
}
