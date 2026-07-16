import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type {
  AttendanceListParams,
  AttendanceRecord,
  AttendanceStatus,
  MarkAttendanceInput,
} from '@/types/teacher/attendance';

function buildQueryString(params: AttendanceListParams) {
  const search = new URLSearchParams();
  search.set('classArmId', params.classArmId);
  if (params.date) search.set('date', params.date);
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  return `?${search.toString()}`;
}

export function useAttendance(params: AttendanceListParams) {
  return useQuery({
    queryKey: ['attendance', 'list', params],
    queryFn: () =>
      apiClient.get<PaginatedResponse<AttendanceRecord>>(
        `/api/teacher/attendance${buildQueryString(params)}`,
      ),
    enabled: !!params.classArmId,
    placeholderData: (previousData) => previousData,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MarkAttendanceInput) =>
      apiClient.post<AttendanceRecord[]>('/api/teacher/attendance', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'list'] });
    },
  });
}

export function useUpdateAttendanceRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AttendanceStatus }) =>
      apiClient.patch<AttendanceRecord>(`/api/teacher/attendance/${id}`, {
        status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'list'] });
    },
  });
}
