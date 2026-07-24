import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  ParentProfile,
  UpdateParentProfileInput,
} from '@/types/parent/parent-profile';

export function useParentProfile() {
  return useQuery({
    queryKey: ['parent-profile', 'detail'],
    queryFn: () => apiClient.get<ParentProfile>('/api/parent/me'),
  });
}

export function useUpdateParentProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateParentProfileInput) =>
      apiClient.patch<ParentProfile>('/api/parent/me', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-profile'] });
    },
  });
}
