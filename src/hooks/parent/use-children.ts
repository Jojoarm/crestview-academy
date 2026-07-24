import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ChildProfile, ChildSummary } from '@/types/parent/child';

export function useChildren() {
  return useQuery({
    queryKey: ['children', 'list'],
    queryFn: () => apiClient.get<ChildSummary[]>('/api/parent/children'),
  });
}

export function useChild(studentId: string) {
  return useQuery({
    queryKey: ['children', 'detail', studentId],
    queryFn: () =>
      apiClient.get<ChildProfile>(`/api/parent/children/${studentId}`),
    enabled: !!studentId,
  });
}
