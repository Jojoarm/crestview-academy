'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { AUDIENCE_COLORS, cn, formatDate } from '@/lib/utils';
import { POST_TYPE_COLORS } from '@/types/post';
import type { RecentPost } from '@/hooks/admin/use-analytics';

type Props = {
  posts: RecentPost[];
  isLoading: boolean;
};

export function RecentPostsList({ posts, isLoading }: Props) {
  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-sans font-semibold text-base text-foreground">
          Recent Posts
        </h2>
        <Link
          href="/admin/posts"
          className="font-body text-xs text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-4 text-center">
          No published posts yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/admin/posts`}
              className="flex flex-col gap-1.5 py-3 px-4 bg-muted/60 border border-border rounded hover:bg-background transition-colors"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                    POST_TYPE_COLORS[post.type],
                  )}
                >
                  {post.type}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                    AUDIENCE_COLORS[post.audience],
                  )}
                >
                  {post.audience}
                </span>
              </div>
              <p className="font-body text-sm font-medium text-foreground truncate">
                {post.title}
              </p>
              {post.publishedAt && (
                <p className="font-body text-xs text-muted-foreground">
                  {formatDate(post.publishedAt)}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
