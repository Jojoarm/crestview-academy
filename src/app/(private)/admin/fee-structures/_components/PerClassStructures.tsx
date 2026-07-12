// Per Class Renderer
// For PerClass + OneTime/Annual: class rows, amount column

import { formatAmount } from '@/lib/utils';
import { FeeStructure } from '@/types/fee';
import { Pencil, Trash2 } from 'lucide-react';

export function PerClassStructures({
  structures,
  onEdit,
  onDelete,
}: {
  structures: FeeStructure[];
  onEdit: (s: FeeStructure) => void;
  onDelete: (s: FeeStructure) => void;
}) {
  if (structures.length === 0) {
    return (
      <p className="font-body text-sm text-muted-foreground py-2">
        No amounts set yet.
      </p>
    );
  }

  // Group by session if annual, otherwise flat
  const bySession: Record<string, FeeStructure[]> = {};
  structures.forEach((s) => {
    const key = s.session?.name ?? 'All Sessions';
    if (!bySession[key]) bySession[key] = [];
    bySession[key].push(s);
  });

  return (
    <div className="flex flex-col gap-3">
      {Object.entries(bySession).map(([sessionName, items]) => (
        <div key={sessionName} className="flex flex-col gap-1.5">
          {Object.keys(bySession).length > 1 && (
            <p className="font-body text-xs text-muted-foreground font-medium">
              {sessionName}
            </p>
          )}
          {items.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 py-2.5 px-3 bg-deep-violet/5 border border-deep-violet/10 rounded"
            >
              <p className="font-body text-sm font-medium text-foreground">
                {s.classLevel?.name ?? '—'}
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <p className="font-body text-sm font-semibold text-deep-violet">
                  {formatAmount(s.amount)}
                </p>
                <button
                  onClick={() => onEdit(s)}
                  className="bg-light-violet/40 hover:bg-light-violet text-muted-foreground hover:text-violet transition-colors border p-2 border-violet/10 hover:border-violet/40 rounded"
                >
                  <Pencil className="size-4.5" />
                </button>
                <button
                  onClick={() => onDelete(s)}
                  className="bg-red-50 hover:bg-red-200 text-muted-foreground hover:text-red-500 transition-colors border p-2 border-red-200 hover:border-red-300 rounded"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
