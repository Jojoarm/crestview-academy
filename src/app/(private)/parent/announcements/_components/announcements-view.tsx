'use client';

import { useState } from 'react';
import { Megaphone } from 'lucide-react';

import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/Pagination';

import { useAnnouncements } from '@/hooks/parent/use-parent-announcements';
import type { PostType } from '@/types/parent/announcement';
import { TypeFilterPills } from './type-filter-pills';
import { AnnouncementCard } from './announcement-card';

const LIMIT = 12;

export function AnnouncementsView() {
  const [type, setType] = useState<PostType | 'All'>('All');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAnnouncements({
    type: type === 'All' ? undefined : type,
    page,
    limit: LIMIT,
  });

  function handleTypeChange(newType: PostType | 'All') {
    setType(newType);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans font-semibold text-2xl text-foreground">
          Announcements
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          News, announcements, and events from the school.
        </p>
      </div>

      <TypeFilterPills value={type} onChange={handleTypeChange} />

      {isLoading && !data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 w-full animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <EmptyState
          icon={Megaphone}
          title="Nothing here yet"
          description="There are no posts to show for this filter right now."
        />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((post) => (
              <AnnouncementCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            total={data.meta.total}
            limit={data.meta.limit}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
