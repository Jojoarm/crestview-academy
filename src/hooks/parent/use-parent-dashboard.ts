import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ParentDashboardResponse } from '@/types/parent/dashboard';

export function useParentDashboard() {
  return useQuery({
    queryKey: ['parent-dashboard'],
    queryFn: () =>
      apiClient.get<ParentDashboardResponse>('/api/parent/dashboard'),
  });
}
