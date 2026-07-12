'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClasses } from '@/hooks/admin/use-classes';
import { SECTIONS, type ClassLevel, type Section } from '@/types/class';
import { ClassCard } from './class-card';
import { ClassFormSheet } from './class-form-sheet';
import { cn } from '@/lib/utils';

const ALL = '' as const;

export function ClassesTab() {
  const [section, setSection] = useState<Section | ''>('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassLevel | null>(null);

  const { data, isLoading } = useClasses(section);
  const classes = data?.data ?? [];

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Section filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSection(ALL)}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-body font-medium transition-colors',
                section === ALL
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-background-100',
              )}
            >
              All
            </button>
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={cn(
                  'px-3 py-1.5 rounded text-xs font-body font-medium transition-colors',
                  section === s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-background-100',
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <Button
            onClick={() => {
              setEditingClass(null);
              setSheetOpen(true);
            }}
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body shrink-0"
          >
            <Plus className="size-4" />
            New Class
          </Button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card/30 border border-border p-5 flex flex-col gap-3"
              >
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                <div className="h-px w-full bg-border" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-card/30 border border-border p-12 text-center">
            <p className="font-body text-sm text-deep-violet">
              No classes found. Create one to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <ClassCard
                key={cls.id}
                classLevel={cls}
                onEdit={(c) => {
                  setEditingClass(c);
                  setSheetOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <ClassFormSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditingClass(null);
        }}
        classLevel={editingClass}
      />
    </>
  );
}
