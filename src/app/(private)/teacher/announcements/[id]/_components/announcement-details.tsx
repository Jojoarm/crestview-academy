'use client';

import { CalendarDays, Megaphone, Newspaper } from 'lucide-react';

import { Card } from '@/components/ui/card';

import { cn, formatDate } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { useTeacherPost } from '@/hooks/teacher/use-teacher-posts';
import { POST_TYPE_COLORS, type PostType } from '@/types/teacher/post';
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
  const { data: post, isLoading, error } = useTeacherPost(postId);

  return (
    <div className="mt-6">
      {error ? (
        <Card className="p-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            {error instanceof ApiError
              ? error.message
              : "This announcement isn't available."}
          </p>
        </Card>
      ) : isLoading || !post ? (
        <div className="space-y-4">
          <div className="h-56 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-32 w-full animate-pulse rounded bg-muted" />
        </div>
      ) : (
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
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                  POST_TYPE_COLORS[post.type],
                )}
              >
                {post.type}
              </span>
              <span className="font-body text-xs text-muted-foreground">
                {post.author.user.name} &middot; {formatDate(post.publishedAt)}
              </span>
            </div>

            <h1 className="font-sans font-semibold text-2xl text-foreground">
              {post.title}
            </h1>

            {post.type === 'Event' && post.eventStartDate && (
              <div className="inline-flex items-center gap-2 rounded-lg bg-terracotta-pale px-3 py-2">
                <CalendarDays className="size-4 text-primary" />
                <p className="font-body text-sm font-medium text-primary">
                  {formatDate(post.eventStartDate)}
                  {post.eventEndDate &&
                    post.eventEndDate !== post.eventStartDate &&
                    ` – ${formatDate(post.eventEndDate)}`}
                </p>
              </div>
            )}

            <p className="font-body text-sm text-foreground whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
