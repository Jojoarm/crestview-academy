'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAcademicSessions } from '@/hooks/shared/use-academic-session';

interface SessionTermPickerProps {
  sessionId: string;
  termId: string;
  onSessionChange: (sessionId: string) => void;
  onTermChange: (termId: string) => void;
}

export function SessionTermPicker({
  sessionId,
  termId,
  onSessionChange,
  onTermChange,
}: SessionTermPickerProps) {
  const { data: sessions, isLoading } = useAcademicSessions();

  const selectedSession = sessions?.find((s) => s.id === sessionId);

  if (isLoading) return null;

  return (
    <div className="flex flex-wrap gap-3">
      <Select value={sessionId} onValueChange={onSessionChange}>
        <SelectTrigger className="w-40 h-9 border-border">
          <SelectValue placeholder="Session" />
        </SelectTrigger>
        <SelectContent>
          {sessions?.map((session) => (
            <SelectItem key={session.id} value={session.id}>
              {session.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={termId}
        onValueChange={onTermChange}
        disabled={!selectedSession}
      >
        <SelectTrigger className="w-35 h-9 border-border">
          <SelectValue placeholder="Term" />
        </SelectTrigger>
        <SelectContent>
          {selectedSession?.terms.map((term) => (
            <SelectItem key={term.id} value={term.id}>
              {term.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
