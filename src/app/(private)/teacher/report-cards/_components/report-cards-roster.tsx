'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { formatClassArmLabel, getInitials } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { useTeacherClasses } from '@/hooks/teacher/use-classes';
import { useClassArmStudents } from '@/hooks/teacher/use-class-arm-students';
import Image from 'next/image';

export function ReportCardsRoster() {
  const router = useRouter();
  const { data: classArms, isLoading: classesLoading } = useTeacherClasses();
  const [classArmId, setClassArmId] = useState('');
  const [search, setSearch] = useState('');

  const activeClassArmId = classArmId || classArms?.[0]?.id || '';

  const {
    data: roster,
    isLoading: rosterLoading,
    error: rosterError,
  } = useClassArmStudents(activeClassArmId);

  const filteredRoster = useMemo(() => {
    if (!roster) return [];
    const q = search.trim().toLowerCase();
    if (!q) return roster;
    return roster.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.admissionNumber.toLowerCase().includes(q),
    );
  }, [roster, search]);

  if (classesLoading) {
    return <div className="h-40 w-full animate-pulse rounded-xl bg-muted" />;
  }

  if (!classArms || classArms.length === 0) {
    return (
      <div className="rounded-xl border border-border p-8 text-center">
        <p className="font-body text-sm text-muted-foreground">
          You&apos;re not a class teacher for any arm this session, so there are
          no report cards to manage here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-semibold text-2xl text-foreground">
            Report Cards
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Select a student to view or edit their report card.
          </p>
        </div>

        {classArms.length > 1 && (
          <Select value={activeClassArmId} onValueChange={setClassArmId}>
            <SelectTrigger className="w-44 h-9 border-border font-body text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              {classArms.map((ca) => (
                <SelectItem key={ca.id} value={ca.id} className="font-body">
                  {formatClassArmLabel(ca)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Card className="p-4">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 border-border font-body text-sm"
          />
        </div>

        {rosterError ? (
          <p className="font-body text-sm text-muted-foreground">
            {rosterError instanceof ApiError
              ? rosterError.message
              : 'Could not load the class roster.'}
          </p>
        ) : rosterLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-12 w-full animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : filteredRoster.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">
            {roster && roster.length > 0
              ? 'No students match your search.'
              : 'No students enrolled in this class arm yet.'}
          </p>
        ) : (
          <div className="space-y-1">
            {filteredRoster.map((student) => (
              <button
                key={student.studentId}
                type="button"
                onClick={() =>
                  router.push(
                    `/teacher/report-cards/${activeClassArmId}/${student.studentId}`,
                  )
                }
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-muted/50 transition-colors"
              >
                {student.photoUrl ? (
                  <Image
                    src={student.photoUrl}
                    alt={student.name}
                    className="size-8 rounded-full object-cover shrink-0"
                    fill
                  />
                ) : (
                  <div className="size-8 rounded-full bg-deep-violet text-primary-foreground flex items-center justify-center text-xs font-body font-medium shrink-0">
                    {getInitials(student.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-body text-sm text-foreground truncate">
                    {student.name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground truncate">
                    {student.admissionNumber}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
