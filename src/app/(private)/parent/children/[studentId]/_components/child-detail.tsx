'use client';

import { Card } from '@/components/ui/card';

import { cn, formatDate, getInitials } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { useChild } from '@/hooks/parent/use-children';
import { formatChildClass, RELATIONSHIP_COLORS } from '@/types/parent/child';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DetailField } from '@/components/DetailField';
import { ChildActionCards } from './child-action-cards';

interface ChildDetailProps {
  studentId: string;
}

export function ChildDetail({ studentId }: ChildDetailProps) {
  const { data: child, isLoading, error } = useChild(studentId);

  return (
    <div className="space-y-6">
      {error ? (
        <Card className="p-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            {error instanceof ApiError
              ? error.message
              : "Could not load this child's profile."}
          </p>
        </Card>
      ) : isLoading || !child ? (
        <div className="space-y-4">
          <div className="h-32 w-full animate-pulse rounded-xl bg-muted" />
          <div className="h-48 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      ) : (
        <>
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 image-border shrink-0">
                <AvatarImage
                  src={child.photoUrl ?? undefined}
                  alt={child.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-deep-violet image-border text-primary-foreground text-lg font-body font-medium">
                  {getInitials(child.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="font-sans font-semibold text-xl text-foreground truncate">
                  {child.name}
                </h1>
                <p className="font-body text-sm text-muted-foreground">
                  {child.admissionNumber} &middot;{' '}
                  {formatChildClass(child.currentClass)}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                      RELATIONSHIP_COLORS[child.relationship],
                    )}
                  >
                    {child.relationship}
                  </span>
                  {child.isPrimary && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-terracotta-pale text-primary">
                      Primary Contact
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-sans font-semibold text-lg text-foreground mb-4">
              Bio-data
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <DetailField
                label="Date of birth"
                value={child.dateOfBirth ? formatDate(child.dateOfBirth) : null}
              />
              <DetailField label="Gender" value={child.gender} />
              <DetailField label="Blood group" value={child.bloodGroup} />
              <DetailField label="Genotype" value={child.genotype} />
              <DetailField
                label="Address"
                value={child.address}
                className="col-span-2 sm:col-span-3"
              />
              <DetailField
                label="Medical conditions"
                value={child.medicalConditions}
                className="col-span-2 sm:col-span-3"
              />
            </div>
          </Card>

          <ChildActionCards studentId={studentId} />
        </>
      )}
    </div>
  );
}
