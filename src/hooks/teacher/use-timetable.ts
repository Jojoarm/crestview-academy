import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { TimetableEntry } from '@/types/teacher/timetable';

export function useTeacherTimetable() {
  return useQuery({
    queryKey: ['teacher-timetable', 'list'],
    queryFn: () => apiClient.get<TimetableEntry[]>('/api/teacher/timetable'),
  });
}
