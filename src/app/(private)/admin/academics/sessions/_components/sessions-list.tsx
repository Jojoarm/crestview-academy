'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessions } from '@/hooks/admin/use-sessions';
import { SessionCard } from './session-card';
import { SessionFormSheet } from './session-form-sheet';
import type { AcademicSession } from '@/types/session';

export function SessionsList() {
  const { data, isLoading } = useSessions();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<AcademicSession | null>(
    null,
  );

  const sessions = data?.data ?? [];

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-semibold text-lg text-(--charcoal)">
              Academic Sessions
            </h2>
            <p className="font-body text-xs text-(--charcoal-100) mt-0.5">
              Manage sessions and their terms
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingSession(null);
              setSheetOpen(true);
            }}
            className="h-9 bg-terracotta hover:bg-(--terracotta-mid) text-white font-body shrink-0"
          >
            <Plus className="size-4" />
            New Session
          </Button>
        </div>

        {/* Sessions */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="bg-white border border-(--border-sand) p-6"
              >
                <div className="flex flex-col gap-3">
                  <div className="h-5 w-32 bg-(--warm-white-dark) animate-pulse rounded" />
                  <div className="h-3 w-48 bg-(--warm-white-dark) animate-pulse rounded" />
                  <div className="h-px w-full bg-(--border-sand) my-2" />
                  <div className="h-4 w-full bg-(--warm-white-dark) animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white border border-(--border-sand) p-12 text-center">
            <p className="font-body text-sm text-(--charcoal-100)">
              No academic sessions yet. Create one to get started.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={(s) => {
                  setEditingSession(s);
                  setSheetOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <SessionFormSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditingSession(null);
        }}
        session={editingSession}
      />
    </>
  );
}
