'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSessions } from '@/hooks/admin/use-sessions';

interface SessionPickerProps {
  sessionId: string;
  onSessionChange: (sessionId: string) => void;
}

export function SessionPicker({
  sessionId,
  onSessionChange,
}: SessionPickerProps) {
  const { data: sessionsData } = useSessions();
  const sessions = sessionsData?.data ?? [];

  return (
    <Select value={sessionId} onValueChange={onSessionChange}>
      <SelectTrigger className="w-40 h-9 border-border font-body text-sm">
        <SelectValue placeholder="Session" />
      </SelectTrigger>
      <SelectContent className="bg-background border-border shadow-lg">
        {sessions.map((s) => (
          <SelectItem key={s.id} value={s.id} className="font-body">
            {s.name}
            {s.isActive && (
              <span className="text-muted-foreground ml-1 text-xs">
                (active)
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
