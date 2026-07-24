'use client';

import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/card';

import { cn, getInitials } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { useChildren } from '@/hooks/parent/use-children';
import { formatChildClass, RELATIONSHIP_COLORS } from '@/types/parent/child';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ChildrenList() {
  const router = useRouter();
  const {
    data: children,
    isLoading: childrenLoading,
    error: childrenError,
  } = useChildren();

  return (
    <div className="space-y-6">
      {/* Children */}
      <Card className="p-5">
        <h2 className="font-sans font-semibold text-lg text-foreground mb-1">
          My Children
        </h2>
        <p className="font-body text-xs text-muted-foreground mb-4">
          Select a child to view their full profile.
        </p>

        {childrenError ? (
          <p className="font-body text-sm text-muted-foreground">
            {childrenError instanceof ApiError
              ? childrenError.message
              : 'Could not load your children.'}
          </p>
        ) : childrenLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-full animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : !children || children.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">
            No children are linked to your account yet.
          </p>
        ) : (
          <div className="space-y-2">
            {children.map((child) => (
              <button
                key={child.studentId}
                type="button"
                onClick={() =>
                  router.push(`/parent/children/${child.studentId}`)
                }
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-muted/50 transition-colors"
              >
                <Avatar className="size-10 image-border shrink-0">
                  <AvatarImage
                    src={child.photoUrl ?? undefined}
                    alt={child.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-deep-violet image-border text-primary-foreground text-sm font-body font-medium">
                    {getInitials(child.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-body text-sm font-medium text-foreground truncate">
                      {child.name}
                    </p>
                    {child.isPrimary && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-body font-medium bg-terracotta-pale text-primary shrink-0">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-muted-foreground truncate">
                    {formatChildClass(child.currentClass)} &middot;{' '}
                    {child.admissionNumber}
                  </p>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium shrink-0',
                    RELATIONSHIP_COLORS[child.relationship],
                  )}
                >
                  {child.relationship}
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
