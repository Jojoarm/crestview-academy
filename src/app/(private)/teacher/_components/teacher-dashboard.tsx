'use client';

import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Check,
  Layers,
  Megaphone,
  UserCheck,
  Users,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { cn, formatDate } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { useTeacherDashboard } from '@/hooks/teacher/use-teacher-dashboard';
import { POST_TYPE_COLORS } from '@/types/teacher/post';
import { MetricCard } from '@/components/MetricCard';
import { useTeacherProfile } from '@/hooks/teacher/use-teacher-profile';

export function TeacherDashboard() {
  const router = useRouter();
  const { data, isLoading, error } = useTeacherDashboard();
  const { data: profile, isLoading: isProfileLoading } = useTeacherProfile();

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="font-body text-sm text-muted-foreground">
          {error instanceof ApiError
            ? error.message
            : 'Could not load your dashboard.'}
        </p>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 w-full animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
        <div className="h-48 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  const { summary, attendanceStatusToday, recentPosts } = data;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {isProfileLoading || !profile ? 'Dashboard' : 'Welcome back,'}
          </p>

          <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">
            {isProfileLoading || !profile ? 'Dashboard' : profile.user.name}
          </h1>
        </div>
        <p className="font-body text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your classes today.
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Class Teacher of"
          value={summary.classTeacherOfCount ?? 0}
          sub={`${summary.classTeacherOfCount > 1 ? 'Classes' : 'Class'}`}
          icon={UserCheck}
          iconClass="bg-[#FAFAF7] text-[#8B8F7E]"
          isLoading={isLoading}
        />
        <MetricCard
          label="Classes You Teach"
          value={summary.teachingClassArmCount ?? 0}
          icon={Layers}
          iconClass="bg-[#F5F3FA] text-[#403C5C]"
          isLoading={isLoading}
        />
        <MetricCard
          label="Subjects Taught"
          value={summary.subjectCount ?? 0}
          icon={BookOpen}
          iconClass="bg-[#FEF4EE] text-[#C66A42]"
          isLoading={isLoading}
        />
        <MetricCard
          label="Total Students"
          value={summary.totalStudents ?? 0}
          icon={Users}
          iconClass="bg-[#F5F7F2] text-[#5F6257]"
          isLoading={isLoading}
        />
      </div>

      {/* Today's attendance — skipped entirely for subject-only teachers */}
      {attendanceStatusToday.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-sans font-semibold text-lg text-foreground">
            Today&apos;s Attendance
          </h2>
          <Card className="p-4">
            <div className="space-y-1">
              {attendanceStatusToday.map((status) => (
                <div
                  key={status.classArmId}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-2"
                >
                  <p className="font-body text-sm text-foreground">
                    {status.classLevel} {status.arm}
                  </p>
                  {status.isMarked ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-600">
                      <Check className="size-4" />
                      <span className="font-body text-xs font-medium">
                        Marked
                      </span>
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => router.push('/teacher/attendance')}
                      className="h-8 bg-primary hover:bg-accent text-primary-foreground font-body text-xs"
                    >
                      Mark Attendance
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Recent posts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-sans font-semibold text-lg text-foreground">
            Recent Announcements
          </h2>
          <button
            type="button"
            onClick={() => router.push('/teacher/announcements')}
            className="font-body text-sm text-primary hover:underline"
          >
            View All
          </button>
        </div>

        {recentPosts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="font-body text-sm text-muted-foreground">
              No announcements yet.
            </p>
          </Card>
        ) : (
          <Card className="p-4">
            <div className="space-y-1">
              {recentPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() =>
                    router.push(`/teacher/announcements/${post.id}`)
                  }
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Megaphone className="size-4 text-muted-foreground shrink-0" />
                    <p className="font-body text-sm text-foreground truncate">
                      {post.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                        POST_TYPE_COLORS[post.type],
                      )}
                    >
                      {post.type}
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
