import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  TeacherProfile,
  UpdateTeacherProfileInput,
} from '@/types/teacher/teacher-profile';

export function useTeacherProfile() {
  return useQuery({
    queryKey: ['teacher-profile', 'detail'],
    queryFn: () => apiClient.get<TeacherProfile>('/api/teacher/me'),
  });
}

export function useUpdateTeacherProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTeacherProfileInput) =>
      apiClient.patch<TeacherProfile>('/api/teacher/me', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-profile'] });
    },
  });
}
