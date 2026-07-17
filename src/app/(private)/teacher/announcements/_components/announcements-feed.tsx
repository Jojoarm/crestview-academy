'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/Pagination';
import { ApiError } from '@/lib/api-client';
import { useTeacherPosts } from '@/hooks/teacher/use-teacher-posts';
import { POST_TYPES, type PostType } from '@/types/teacher/post';
import { FilterPill } from './FilterPill';
import { PostCard } from './PostCard';

export function AnnouncementsFeed() {
  const router = useRouter();
  const [type, setType] = useState<PostType | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useTeacherPosts({
    type: type || undefined,
    page,
    limit: 12,
  });

  const posts = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans font-semibold text-2xl text-foreground">
          Announcements
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          News, announcements, and events shared by the school.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterPill
          label="All"
          active={type === ''}
          onClick={() => {
            setType('');
            setPage(1);
          }}
        />
        {POST_TYPES.map((t) => (
          <FilterPill
            key={t}
            label={t}
            active={type === t}
            onClick={() => {
              setType(t);
              setPage(1);
            }}
          />
        ))}
      </div>

      {error ? (
        <Card className="p-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            {error instanceof ApiError
              ? error.message
              : 'Could not load announcements.'}
          </p>
        </Card>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 w-full animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            No announcements yet.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => router.push(`/teacher/announcements/${post.id}`)}
            />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
