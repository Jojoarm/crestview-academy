import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { SessionSummary } from '@/types/teacher/report-card';

export function useAcademicSessions() {
  return useQuery({
    queryKey: ['teacher-sessions', 'list'],
    queryFn: () => apiClient.get<SessionSummary[]>('/api/shared/sessions'),
    staleTime: 5 * 60 * 1000,
  });
}
