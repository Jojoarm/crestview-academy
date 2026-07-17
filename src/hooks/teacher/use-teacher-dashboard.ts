import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Dashboard } from '@/types/teacher/dashboard';

export function useTeacherDashboard() {
  return useQuery({
    queryKey: ['teacher-dashboard'],
    queryFn: () => apiClient.get<Dashboard>('/api/teacher/dashboard'),
  });
}
