import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  PostSummary,
  PostsListParams,
  PostsListResponse,
} from '@/types/parent/announcement';

function buildQueryString(params: PostsListParams) {
  const search = new URLSearchParams();
  if (params.type) search.set('type', params.type);
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function useAnnouncements(params: PostsListParams) {
  return useQuery({
    queryKey: ['parent-announcements', 'list', params],
    queryFn: () =>
      apiClient.get<PostsListResponse>(
        `/api/parent/posts${buildQueryString(params)}`,
      ),
    placeholderData: (previousData) => previousData,
  });
}

export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: ['parent-announcements', 'detail', id],
    queryFn: () => apiClient.get<PostSummary>(`/api/parent/posts/${id}`),
    enabled: !!id,
  });
}
