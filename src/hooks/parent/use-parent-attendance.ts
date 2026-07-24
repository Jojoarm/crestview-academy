import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  ChildAttendanceParams,
  ChildAttendanceResponse,
} from '@/types/parent/attendance';

function buildQueryString(params: ChildAttendanceParams) {
  const search = new URLSearchParams();
  if (params.sessionId) search.set('sessionId', params.sessionId);
  if (params.termId) search.set('termId', params.termId);
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function useChildAttendance(
  studentId: string,
  params: ChildAttendanceParams,
) {
  return useQuery({
    queryKey: ['parent-attendance', 'list', studentId, params],
    queryFn: () =>
      apiClient.get<ChildAttendanceResponse>(
        `/api/parent/children/${studentId}/attendance${buildQueryString(params)}`,
      ),
    enabled: !!studentId,
    placeholderData: (previousData) => previousData,
  });
}
