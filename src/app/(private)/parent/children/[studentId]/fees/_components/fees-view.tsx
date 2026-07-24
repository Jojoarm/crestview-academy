'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';

import { ApiError } from '@/lib/api-client';
import { useChildFees } from '@/hooks/parent/use-parent-fees';
import { FeeSection } from './fee-section';

interface FeesViewProps {
  studentId: string;
}

export function FeesView({ studentId }: FeesViewProps) {
  const router = useRouter();
  const { data, isLoading, error } = useChildFees(studentId);

  const notEnrolled = error instanceof ApiError && error.statusCode === 404;

  const hasAnyFees =
    data && (data.fees.annual.length > 0 || data.fees.perTerm.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/parent/children/${studentId}`)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-sans font-semibold text-xl text-foreground truncate">
            Fees
          </h1>
          {data && (
            <p className="font-body text-xs text-muted-foreground">
              {data.classArm.classLevel} {data.classArm.arm} &middot; Current
              term
            </p>
          )}
        </div>
      </div>

      {notEnrolled && (
        <EmptyState
          icon={Wallet}
          title="Not enrolled this session"
          description="This child isn't currently enrolled in a class, so there are no fees to show."
        />
      )}

      {isLoading && !data && (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-32 w-full animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      )}

      {data && !hasAnyFees && (
        <EmptyState
          icon={Wallet}
          title="No fees assigned"
          description="No fees have been set up for this child's class yet."
        />
      )}

      {data && hasAnyFees && (
        <>
          <FeeSection
            title="Annual Fees"
            description="Charged once per academic session."
            items={data.fees.annual}
          />
          <FeeSection
            title="Per-Term Fees"
            description="Charged every term."
            items={data.fees.perTerm}
          />
        </>
      )}
    </div>
  );
}
