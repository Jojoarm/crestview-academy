import { useRouter } from 'next/navigation';
import { Megaphone, Newspaper, CalendarDays } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';
import {
  POST_TYPE_COLORS,
  type PostSummary,
} from '@/types/parent/announcement';
import Image from 'next/image';

const TYPE_ICONS = {
  Announcement: Megaphone,
  News: Newspaper,
  Event: CalendarDays,
};

export function AnnouncementCard({ post }: { post: PostSummary }) {
  const router = useRouter();
  const TypeIcon = TYPE_ICONS[post.type];

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md p-0"
      onClick={() => router.push(`/parent/announcements/${post.id}`)}
    >
      {post.bannerImageUrl ? (
        <Image
          src={post.bannerImageUrl}
          alt={post.title}
          className="h-36 w-full object-cover"
          fill
        />
      ) : (
        <div className="h-36 w-full flex items-center justify-center bg-deep-violet">
          <div
            className={cn(
              'image-border rounded-full p-2',
              POST_TYPE_COLORS[post.type],
            )}
          >
            <TypeIcon className="size-8 " />
          </div>
        </div>
      )}

      <div className="p-4 space-y-2">
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

        <h3 className="font-sans font-semibold text-base text-foreground line-clamp-2">
          {post.title}
        </h3>

        <p className="font-body text-sm text-muted-foreground line-clamp-2">
          {post.content}
        </p>

        {post.type === 'Event' && post.eventStartDate && (
          <p className="font-body text-xs text-primary font-medium">
            {formatDate(post.eventStartDate)}
            {post.eventEndDate && ` – ${formatDate(post.eventEndDate)}`}
          </p>
        )}
      </div>
    </Card>
  );
}
