import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export type CapacityOverview = {
  id: string;
  name: string;
  section: 'Kindergarten' | 'Nursery' | 'Primary' | 'Secondary';
  capacity: number;
  enrolled: number;
  available: number;
  percentFull: number;
};

export type RecentPost = {
  id: string;
  title: string;
  type: 'Announcement' | 'News' | 'Event';
  audience: 'Everyone' | 'Teachers' | 'Parents' | 'Students';
  publishedAt: string | null;
  eventStartDate: string | null;
};

export type UpcomingEvent = {
  id: string;
  title: string;
  audience: 'Everyone' | 'Teachers' | 'Parents' | 'Students';
  eventStartDate: string | null;
  eventEndDate: string | null;
};

export type DashboardStats = {
  session: {
    id: string;
    name: string;
    activeTerm: { id: string; name: string } | null;
  } | null;
  users: {
    students: { total: number; active: number };
    teachers: { total: number; active: number };
    parents: number;
    admins: number;
  };
  enrollment: {
    total: number;
    bySection: {
      Kindergarten: number;
      Nursery: number;
      Primary: number;
      Secondary: number;
    };
  };
  classes: {
    total: number;
    totalArms: number;
    capacityOverview: CapacityOverview[];
  };
  subjects: {
    total: number;
    totalAssignments: number;
  };
  teachers: {
    classAssignments: number;
    subjectAssignments: number;
  };
  fees: {
    activeStructures: number;
  };
  posts: {
    total: number;
    published: number;
    drafts: number;
    upcomingEvents: number;
    recent: RecentPost[];
    events: UpcomingEvent[];
  };
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.get<DashboardStats>('/api/admin/analytics/stats'),
    staleTime: 5 * 60 * 1000,
  });
}
