import { cn } from '@/lib/utils';

export function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm font-body font-medium border transition-colors',
        active
          ? 'bg-primary text-primary-foreground border-transparent'
          : 'bg-transparent text-muted-foreground border-border hover:bg-muted',
      )}
    >
      {label}
    </button>
  );
}
