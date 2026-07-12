//  Matrix Renderer
// For PerTerm + PerClass: classes as rows, terms as columns — the tuition case

import { formatAmount } from '@/lib/utils';
import { FeeStructure } from '@/types/fee';
import { Pencil, Trash2 } from 'lucide-react';

export function MatrixStructures({
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

  // Get unique classes and terms
  const classMap: Record<string, string> = {};
  const termMap: Record<string, string> = {};
  structures.forEach((s) => {
    if (s.classLevel) classMap[s.classLevel.id] = s.classLevel.name;
    if (s.term) termMap[s.term.id] = `${s.term.name} Term`;
  });

  const classIds = Object.keys(classMap);
  const termIds = Object.keys(termMap);

  // Build lookup: classId+termId → structure
  const lookup: Record<string, FeeStructure> = {};
  structures.forEach((s) => {
    if (s.classLevelId && s.termId) {
      lookup[`${s.classLevelId}__${s.termId}`] = s;
    }
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left font-sans text-xs text-muted-foreground font-semibold py-2 pr-4 min-w-28">
              Class
            </th>
            {termIds.map((termId) => (
              <th
                key={termId}
                className="text-left font-sans text-xs text-muted-foreground font-semibold py-2 px-3 min-w-36"
              >
                {termMap[termId]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {classIds.map((classId) => (
            <tr key={classId} className="border-t border-border/30">
              <td className="font-body text-sm font-medium text-foreground py-2.5 pr-4">
                {classMap[classId]}
              </td>
              {termIds.map((termId) => {
                const structure = lookup[`${classId}__${termId}`];
                return (
                  <td key={termId} className="py-2.5 px-3">
                    {structure ? (
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm font-medium text-foreground-100">
                          {formatAmount(structure.amount)}
                        </span>
                        <button
                          onClick={() => onEdit(structure)}
                          className="text-sage hover:text-green-800 transition-colors"
                        >
                          <Pencil className="size-3" />
                        </button>
                        <button
                          onClick={() => onDelete(structure)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-body text-xs text-muted-foreground italic">
                        Not set
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
