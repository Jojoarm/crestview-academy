'use client';

import { CalendarOff, Users } from 'lucide-react';

import { EmptyState } from '@/components/EmptyState';
import { useParentDashboard } from '@/hooks/parent/use-parent-dashboard';
import { ChildSummaryCard } from './child-summary-card';
import { AssignmentsDueSection } from './assignments-due-section';
import { RecentPostsSection } from './recent-posts-section';
import { useParentProfile } from '@/hooks/parent/use-parent-profile';

export function ParentDashboardView() {
  const { data, isLoading } = useParentDashboard();
  const { data: profile, isLoading: isProfileLoading } = useParentProfile();

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-40 w-full animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="font-body text-sm text-muted-foreground">
            {isProfileLoading || !profile ? 'Dashboard' : 'Welcome back,'}
          </p>

          <h1 className="font-sans font-semibold text-3xl text-foreground">
            {isProfileLoading || !profile
              ? 'Parent Dashboard'
              : profile.user.name}
          </h1>
        </div>

        <p className="font-body text-sm text-muted-foreground">
          Stay up to date with your child&apos;s academic progress, attendance,
          assignments, and school activities.
        </p>
      </div>

      {!data.term && (
        <EmptyState
          icon={CalendarOff}
          title="No active term right now"
          description="Attendance, report cards, and upcoming assignments will show here once a new term is active."
        />
      )}

      {data.children.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No children linked yet"
          description="Once a child is linked to your account, their summary will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.children.map((child) => (
            <ChildSummaryCard key={child.studentId} child={child} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AssignmentsDueSection
          assignments={data.assignmentsDueSoon}
          childrenList={data.children}
        />
        <RecentPostsSection posts={data.recentPosts} />
      </div>
    </div>
  );
}
