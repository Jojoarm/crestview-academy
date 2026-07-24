import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, formatDate } from '@/lib/utils';
import { POST_TYPE_COLORS } from '@/types/parent/announcement';
import type { RecentPost } from '@/types/parent/dashboard';

export function RecentPostsSection({ posts }: { posts: RecentPost[] }) {
  const router = useRouter();

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-sans font-semibold text-lg text-foreground">
          Latest Announcements
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/parent/announcements')}
          className="h-7 text-xs font-body text-primary hover:text-primary"
        >
          View All
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-4 text-center">
          No announcement yet.
        </p>
      ) : (
        <div className="space-y-1">
          {posts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => router.push(`/parent/announcements/${post.id}`)}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-muted/50 transition-colors"
            >
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium shrink-0',
                  POST_TYPE_COLORS[post.type],
                )}
              >
                {post.type}
              </span>
              <p className="font-body text-sm text-foreground truncate flex-1">
                {post.title}
              </p>
              <span className="font-body text-xs text-muted-foreground shrink-0">
                {formatDate(post.publishedAt)}
              </span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
