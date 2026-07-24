'use client';

import { cn } from '@/lib/utils';
import type { PostType } from '@/types/parent/announcement';

const FILTERS: { label: string; value: PostType | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Announcements', value: 'Announcement' },
  { label: 'News', value: 'News' },
  { label: 'Events', value: 'Event' },
];

interface TypeFilterPillsProps {
  value: PostType | 'All';
  onChange: (value: PostType | 'All') => void;
}

export function TypeFilterPills({ value, onChange }: TypeFilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors',
            value === filter.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/70',
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
