import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type { TeacherPost, TeacherPostListParams } from '@/types/teacher/post';

function buildQueryString(params: TeacherPostListParams) {
  const search = new URLSearchParams();
  if (params.type) search.set('type', params.type);
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function useTeacherPosts(params: TeacherPostListParams) {
  return useQuery({
    queryKey: ['teacher-posts', 'list', params],
    queryFn: () =>
      apiClient.get<PaginatedResponse<TeacherPost>>(
        `/api/teacher/posts${buildQueryString(params)}`,
      ),
    placeholderData: (previousData) => previousData,
  });
}

export function useTeacherPost(id: string) {
  return useQuery({
    queryKey: ['teacher-posts', 'detail', id],
    queryFn: () => apiClient.get<TeacherPost>(`/api/teacher/posts/${id}`),
    enabled: !!id,
  });
}
