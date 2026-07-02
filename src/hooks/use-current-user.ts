import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';
import { CurrentUser } from '@/lib/types';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    retry: false,
    queryFn: async () => {
      try {
        return await apiClient.get<CurrentUser>('/api/profile/me');
      } catch (error) {
        if (error instanceof ApiError && error.statusCode === 401) {
          return null;
        }

        throw error;
      }
    },
  });
}
