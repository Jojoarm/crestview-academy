// src/app/(private)/admin/sessions/_components/session-card.tsx

'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Zap, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { AcademicSession, Term } from '@/types/session';
import { TermFormSheet } from './team-form-sheet';
import { ActivateDialog } from './activate-dialog';
import { DeleteSessionDialog } from './delete-session-dialog';
import { DeleteTermDialog } from './delete-term-dialog';

type Props = {
  session: AcademicSession;
  onEdit: (session: AcademicSession) => void;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function SessionCard({ session, onEdit }: Props) {
  const [termSheetOpen, setTermSheetOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [activatingSession, setActivatingSession] = useState(false);
  const [activatingTerm, setActivatingTerm] = useState<Term | null>(null);
  const [deletingSession, setDeletingSession] = useState(false);
  const [deletingTerm, setDeletingTerm] = useState<Term | null>(null);

  return (
    <>
      <div
        className={cn(
          'bg-white border p-6 flex flex-col gap-5',
          session.isActive
            ? 'border-l-4 border-l-terracotta border-(--border-sand)'
            : 'border-(--border-sand)',
        )}
      >
        {/* Session Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-sans font-medium text-xl text-(--charcoal)">
                {session.name}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                  session.isActive
                    ? 'bg-terracotta-pale text-terracotta'
                    : 'bg-(--warm-white-dark) text-(--charcoal-100)',
                )}
              >
                {session.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="font-body text-sm text-(--charcoal-100) mt-1">
              {formatDate(session.startDate)} — {formatDate(session.endDate)}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:bg-(--warm-white-dark) shrink-0"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Session actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border-(--border-sand) w-48 shadow-lg rounded-xl p-2"
            >
              <DropdownMenuItem
                onClick={() => onEdit(session)}
                className="font-body cursor-pointer"
              >
                <Pencil className="size-4" />
                Edit session
              </DropdownMenuItem>
              {!session.isActive && (
                <DropdownMenuItem
                  onClick={() => setActivatingSession(true)}
                  className="font-body cursor-pointer text-emerald-600 focus:text-emerald-600"
                >
                  <Zap className="size-4" />
                  Set as active
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingSession(true)}
                className="font-body cursor-pointer text-red-600 focus:text-white"
              >
                <Trash2 className="size-4" />
                Delete session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Terms */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-body text-xs font-medium uppercase tracking-widest text-terracotta-light">
              Terms
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingTerm(null);
                setTermSheetOpen(true);
              }}
              className="h-7 text-xs font-body text-terracotta hover:bg-terracotta-pale hover:text-terracotta gap-1"
            >
              <Plus className="size-3" />
              Add term
            </Button>
          </div>

          {session.terms.length === 0 ? (
            <p className="font-body text-sm text-(--charcoal-100) py-2">
              No terms added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {session.terms.map((term) => (
                <div
                  key={term.id}
                  className="flex items-center justify-between gap-4 py-3 px-4 bg-(--warm-white)/60 border border-(--border-sand)/30 rounded-xl"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-body text-sm font-medium text-(--charcoal)">
                        {term.name} Term
                      </p>
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                          term.isActive
                            ? 'bg-white text-ember'
                            : 'bg-(--warm-white-dark) text-(--charcoal-100)',
                        )}
                      >
                        {term.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="font-body text-xs text-(--charcoal-100) mt-0.5">
                      {formatDate(term.startDate)} — {formatDate(term.endDate)}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 hover:bg-(--warm-white-dark) shrink-0"
                      >
                        <MoreHorizontal className="size-3.5" />
                        <span className="sr-only">Term actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white border-(--border-sand) w-48 shadow-lg rounded-xl p-2"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingTerm(term);
                          setTermSheetOpen(true);
                        }}
                        className="font-body cursor-pointer"
                      >
                        <Pencil className="size-4" />
                        Edit term
                      </DropdownMenuItem>
                      {!term.isActive && (
                        <DropdownMenuItem
                          onClick={() => setActivatingTerm(term)}
                          className="font-body cursor-pointer text-emerald-600 focus:text-emerald-600"
                        >
                          <Zap className="size-4" />
                          Set as active
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeletingTerm(term)}
                        className="font-body cursor-pointer text-red-600 focus:text-white"
                      >
                        <Trash2 className="size-4" />
                        Delete term
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TermFormSheet
        open={termSheetOpen}
        onOpenChange={(open) => {
          setTermSheetOpen(open);
          if (!open) setEditingTerm(null);
        }}
        sessionId={session.id}
        existingTermNames={session.terms.map((t) => t.name)}
        term={editingTerm}
      />

      <ActivateDialog
        open={activatingSession}
        onClose={() => setActivatingSession(false)}
        type="session"
        name={session.name}
        sessionId={session.id}
      />

      {activatingTerm && (
        <ActivateDialog
          open={!!activatingTerm}
          onClose={() => setActivatingTerm(null)}
          type="term"
          name={`${activatingTerm.name} Term`}
          sessionId={session.id}
          termId={activatingTerm.id}
        />
      )}

      <DeleteSessionDialog
        open={deletingSession}
        onClose={() => setDeletingSession(false)}
        session={session}
      />

      {deletingTerm && (
        <DeleteTermDialog
          open={!!deletingTerm}
          onClose={() => setDeletingTerm(null)}
          sessionId={session.id}
          term={deletingTerm}
        />
      )}
    </>
  );
}
