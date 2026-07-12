import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Props = {
  backHref: string;
  name: string;
  subtitle: string;
  isBanned: boolean;
  avatarClassName: string;
  statusText?: {
    active: string;
    inactive: string;
  };
  wrapSubtitle?: boolean;
};

export function UserProfileHeader({
  backHref,
  name,
  subtitle,
  isBanned,
  avatarClassName,
  statusText = {
    active: 'Active',
    inactive: 'Suspended',
  },
  wrapSubtitle = false,
}: Props) {
  const router = useRouter();

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push(backHref)}
        className="hover:bg-muted"
      >
        <ArrowLeft className="size-4" />
      </Button>

      <div className="flex items-center gap-4 min-w-0">
        <div
          className={cn(
            'size-10 rounded-full image-border flex items-center justify-center text-sm font-body font-semibold shrink-0',
            avatarClassName,
          )}
        >
          {initials}
        </div>

        <div className="min-w-0">
          <h1 className="font-sans font-semibold text-xl text-foreground truncate">
            {name}
          </h1>

          <div
            className={cn(
              'flex items-center gap-2 mt-0.5',
              wrapSubtitle && 'flex-wrap',
            )}
          >
            <span className="font-body text-xs text-muted-foreground">
              {subtitle}
            </span>

            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                isBanned
                  ? 'bg-red-50 text-red-600'
                  : 'bg-emerald-50 text-emerald-700',
              )}
            >
              {isBanned ? statusText.inactive : statusText.active}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
