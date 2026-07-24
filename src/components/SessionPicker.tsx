'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAcademicSessions } from '@/hooks/shared/use-academic-session';

interface SessionPickerProps {
  sessionId: string;
  onSessionChange: (sessionId: string) => void;
}

export function SessionPicker({
  sessionId,
  onSessionChange,
}: SessionPickerProps) {
  const { data: sessions, isLoading } = useAcademicSessions();

  if (isLoading) return null;

  return (
    <Select value={sessionId} onValueChange={onSessionChange}>
      <SelectTrigger className="w-40 h-9 border-border font-body text-sm">
        <SelectValue placeholder="Session" />
      </SelectTrigger>
      <SelectContent className="bg-background border-border shadow-lg">
        {sessions?.map((session) => (
          <SelectItem key={session.id} value={session.id} className="font-body">
            {session.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
