import { Card } from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';
import { POST_TYPE_COLORS, PostType, TeacherPost } from '@/types/teacher/post';
import { CalendarDays, Megaphone, Newspaper } from 'lucide-react';
import Image from 'next/image';

const TYPE_ICONS: Record<PostType, typeof Megaphone> = {
  Announcement: Megaphone,
  News: Newspaper,
  Event: CalendarDays,
};

export function PostCard({
  post,
  onClick,
}: {
  post: TeacherPost;
  onClick: () => void;
}) {
  const Icon = TYPE_ICONS[post.type];

  return (
    <Card
      onClick={onClick}
      className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md p-0"
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
            <Icon className="size-8 " />
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
          <span className="font-body text-xs text-muted-foreground shrink-0">
            {formatDate(post.publishedAt)}
          </span>
        </div>

        <h2 className="font-sans font-medium text-base text-foreground line-clamp-2">
          {post.title}
        </h2>

        {post.type === 'Event' && post.eventStartDate && (
          <p className="font-body text-xs text-primary font-medium">
            {formatDate(post.eventStartDate)}
            {post.eventEndDate &&
              post.eventEndDate !== post.eventStartDate &&
              ` – ${formatDate(post.eventEndDate)}`}
          </p>
        )}

        <p className="font-body text-sm text-muted-foreground line-clamp-2">
          {post.content}
        </p>

        <p className="font-body text-xs text-muted-foreground">
          {post.author.user.name}
        </p>
      </div>
    </Card>
  );
}
