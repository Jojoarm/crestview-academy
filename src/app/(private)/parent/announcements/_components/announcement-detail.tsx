'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, Megaphone, Newspaper } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';

import { cn, formatDate } from '@/lib/utils';
import { useAnnouncement } from '@/hooks/parent/use-parent-announcements';
import { POST_TYPE_COLORS, PostType } from '@/types/parent/announcement';
import Image from 'next/image';

const TYPE_ICONS: Record<PostType, typeof Megaphone> = {
  Announcement: Megaphone,
  News: Newspaper,
  Event: CalendarDays,
};

interface AnnouncementDetailProps {
  postId: string;
}

export function AnnouncementDetail({ postId }: AnnouncementDetailProps) {
  const router = useRouter();
  const { data: post, isLoading, error } = useAnnouncement(postId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/parent/announcements')}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="font-sans font-semibold text-xl text-foreground">
          Announcement
        </h1>
      </div>

      {error && (
        <EmptyState
          icon={CalendarDays}
          title="Not found"
          description="This post doesn't exist or isn't available to you."
        />
      )}

      {isLoading && !post && (
        <div className="space-y-4">
          <div className="h-56 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-32 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      )}

      {post && (
        <Card className="overflow-hidden p-0 rounded">
          {post.bannerImageUrl ? (
            <Image
              src={post.bannerImageUrl}
              alt={post.title}
              className="h-56 w-full object-cover"
              fill
            />
          ) : (
            <div className="h-40 w-full flex items-center justify-center bg-deep-violet">
              {(() => {
                const Icon = TYPE_ICONS[post.type];
                return (
                  <div
                    className={cn(
                      'image-border rounded-full p-2',
                      POST_TYPE_COLORS[post.type],
                    )}
                  >
                    <Icon className="size-8 " />
                  </div>
                );
              })()}
            </div>
          )}

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                  POST_TYPE_COLORS[post.type],
                )}
              >
                {post.type}
              </span>
              <span className="font-body text-xs text-muted-foreground">
                {formatDate(post.publishedAt)}
              </span>
            </div>

            <h2 className="font-sans font-semibold text-2xl text-foreground">
              {post.title}
            </h2>

            {post.type === 'Event' && post.eventStartDate && (
              <p className="font-body text-sm text-primary font-medium">
                {formatDate(post.eventStartDate)}
                {post.eventEndDate && ` – ${formatDate(post.eventEndDate)}`}
              </p>
            )}

            <p className="font-body text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
