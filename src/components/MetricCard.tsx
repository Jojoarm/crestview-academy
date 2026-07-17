import { Card } from './ui/card';

export function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  iconClass,
  isLoading,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ElementType;
  iconClass: string;
  isLoading: boolean;
}) {
  return (
    <Card className="p-5 flex flex-row gap-3.5 relative overflow-hidden group">
      <div
        className={`h-fit p-2 rounded-xl shadow-md image-border shrink-0 ${iconClass}`}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide leading-none">
          {label}
        </p>
        {isLoading ? (
          <div className="h-7 w-16 bg-muted animate-pulse rounded" />
        ) : (
          <p className="font-sans font-bold text-2xl text-deep-violet leading-none tabular-nums">
            {value.toLocaleString()}
          </p>
        )}
        {sub && !isLoading && (
          <p className="text-xs text-muted-foreground">{sub}</p>
        )}
      </div>
    </Card>
  );
}
