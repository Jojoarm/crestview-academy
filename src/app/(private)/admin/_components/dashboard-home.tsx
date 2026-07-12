'use client';

import { useDashboardStats } from '@/hooks/admin/use-analytics';
import { SessionBanner } from './session-banner';
import { KeyMetricCards } from './key-metric-cards';
import { EnrollmentBySection } from './enrollment-by-section';
import { SchoolOverviewCards } from './school-overview-cards';
import { CapacityTable } from './capacity-table';
import { RecentPostsList } from './recent-posts-list';
import { UpcomingEventsList } from './upcoming-events-list';

export function DashboardHome() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="flex flex-col gap-6">
      <SessionBanner session={stats?.session ?? null} isLoading={isLoading} />
      <KeyMetricCards stats={stats} isLoading={isLoading} />
      <EnrollmentBySection
        bySection={stats?.enrollment.bySection}
        sessionName={stats?.session?.name}
        isLoading={isLoading}
      />
      <SchoolOverviewCards stats={stats} isLoading={isLoading} />
      <CapacityTable
        overview={stats?.classes.capacityOverview ?? []}
        isLoading={isLoading}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentPostsList
          posts={stats?.posts.recent ?? []}
          isLoading={isLoading}
        />
        <UpcomingEventsList
          events={stats?.posts.events ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
