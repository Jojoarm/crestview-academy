import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type { Post, PostType, PostStatus, PostAudience } from '@/types/post';

export const postKeys = {
  all: ['posts'] as const,
  list: (params?: PostParams) => ['posts', 'list', params] as const,
};

type PostParams = {
  search?: string;
  type?: PostType | '';
  status?: PostStatus | '';
  audience?: PostAudience | '';
  page?: number;
  limit?: number;
};

export function usePosts(params: PostParams = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.search) search.set('search', params.search);
      if (params.type) search.set('type', params.type);
      if (params.status) search.set('status', params.status);
      if (params.audience) search.set('audience', params.audience);
      if (params.page) search.set('page', String(params.page));
      if (params.limit) search.set('limit', String(params.limit));
      return apiClient.get<PaginatedResponse<Post>>(
        `/api/admin/posts?${search}`,
      );
    },
  });
}

// Mutations

type CreatePostPayload = {
  title: string;
  content: string;
  type: PostType;
  audience: PostAudience;
  eventStartDate?: string;
  eventEndDate?: string;
};

type UpdatePostPayload = Partial<CreatePostPayload>;

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) =>
      apiClient.post<Post>('/api/admin/posts', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePostPayload) =>
      apiClient.patch<Post>(`/api/admin/posts/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function usePublishPost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.patch<Post>(`/api/admin/posts/${id}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useDeletePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
