import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  ChildAssignmentsParams,
  ChildAssignmentsResponse,
} from '@/types/parent/assignment';

function buildQueryString(params: ChildAssignmentsParams) {
  const search = new URLSearchParams();
  if (params.sessionId) search.set('sessionId', params.sessionId);
  if (params.termId) search.set('termId', params.termId);
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function useChildAssignments(
  studentId: string,
  params: ChildAssignmentsParams,
) {
  return useQuery({
    queryKey: ['parent-assignments', 'list', studentId, params],
    queryFn: () =>
      apiClient.get<ChildAssignmentsResponse>(
        `/api/parent/children/${studentId}/assignments${buildQueryString(params)}`,
      ),
    enabled: !!studentId,
    placeholderData: (previousData) => previousData,
  });
}
