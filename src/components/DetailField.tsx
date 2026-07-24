export function DetailField({
  label,
  value,
  className,
}: {
  label: string;
  value: string | null | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground font-semibold capitalize tracking-wide">
        {label}
      </p>
      <p className="font-body text-sm text-foreground mt-0.5">
        {value || <span className="text-muted-foreground">Not set</span>}
      </p>
    </div>
  );
}
