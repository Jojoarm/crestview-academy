import { formatAmount } from '@/lib/utils';
import { FeeStructure } from '@/types/fee';
import { Pencil, Trash2 } from 'lucide-react';

export function SchoolWideStructures({
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

  return (
    <div className="flex flex-col gap-1.5">
      {structures.map((s) => {
        const label = [s.session?.name, s.term ? `${s.term.name} Term` : null]
          .filter(Boolean)
          .join(' · ');

        return (
          <div
            key={s.id}
            className="flex items-center justify-between gap-3 py-2.5 px-3 bg-muted/50 border border-border/30 rounded"
          >
            <p className="font-body text-sm text-muted-foreground">
              {label || 'All sessions'}
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <p className="font-body text-sm font-semibold text-foreground">
                {formatAmount(s.amount)}
              </p>
              <button
                onClick={() => onEdit(s)}
                className="text-green-800 hover:text-green-600 transition-colors"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                onClick={() => onDelete(s)}
                className="text-red-400 hover:text-red-700 transition-colors"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
