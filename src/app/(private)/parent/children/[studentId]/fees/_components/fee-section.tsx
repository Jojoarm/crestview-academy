import { Card } from '@/components/ui/card';
import { formatNaira } from '@/lib/utils';
import { type FeeLineItem } from '@/types/parent/fee';

interface FeeSectionProps {
  title: string;
  description: string;
  items: FeeLineItem[];
}

export function FeeSection({ title, description, items }: FeeSectionProps) {
  if (items.length === 0) return null;

  return (
    <Card className="p-4">
      <h2 className="font-sans font-semibold text-lg text-foreground mb-1">
        {title}
      </h2>
      <p className="font-body text-xs text-muted-foreground mb-4">
        {description}
      </p>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 border-t border-border/50 pt-3 first:border-t-0 first:pt-0"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="font-body text-sm font-medium text-foreground">
                  {item.feeType.name}
                </p>
                {item.feeType.isOptional && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-body font-medium bg-light-violet text-deep-violet image-border">
                    Optional
                  </span>
                )}
                {item.term && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-body font-medium bg-terracotta-pale text-primary image-border">
                    {item.term.name} Term
                  </span>
                )}
                {item.session && !item.term && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-body font-medium bg-foreground text-background image-border">
                    {item.session.name}
                  </span>
                )}
              </div>
              {item.feeType.description && (
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  {item.feeType.description}
                </p>
              )}
            </div>
            <p className="font-body text-sm font-medium text-foreground tabular-nums shrink-0">
              {formatNaira(parseFloat(item.amount))}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
