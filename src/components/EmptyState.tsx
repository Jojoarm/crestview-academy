import type { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted image-border">
        <Icon className="size-8 text-primary" />
      </div>

      <h3 className="font-sans font-semibold text-xl text-foreground">
        {title}
      </h3>

      <p className="mt-2 max-w-4xl font-body text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
