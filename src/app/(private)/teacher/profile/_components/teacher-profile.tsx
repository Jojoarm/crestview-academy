'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { cn, formatClassArmLabel, formatDate, getInitials } from '@/lib/utils';
import { ApiError } from '@/lib/api-client';
import { useTeacherProfile } from '@/hooks/teacher/use-teacher-profile';
import { useTeacherClasses } from '@/hooks/teacher/use-classes';
import { useTeacherSubjects } from '@/hooks/teacher/use-subjects';

import { EditProfileSheet } from './edit-profile-sheet';
import Image from 'next/image';

export function TeacherProfileView() {
  const [editOpen, setEditOpen] = useState(false);

  const { data: profile, isLoading } = useTeacherProfile();
  const {
    data: classes,
    isLoading: classesLoading,
    error: classesError,
  } = useTeacherClasses();
  const {
    data: subjects,
    isLoading: subjectsLoading,
    error: subjectsError,
  } = useTeacherSubjects();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-48 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="font-body text-sm text-muted-foreground">
        We couldn&apos;t load your profile. Try refreshing the page.
      </p>
    );
  }

  // Group subject assignments by subject so "Mathematics" taught across
  // three class arms shows as one row with three chips, not three rows.
  const subjectGroups = (subjects ?? []).reduce<
    Record<string, { name: string; code: string; classArms: string[] }>
  >((acc, sa) => {
    if (!acc[sa.subjectId]) {
      acc[sa.subjectId] = {
        name: sa.subject.name,
        code: sa.subject.code,
        classArms: [],
      };
    }
    acc[sa.subjectId].classArms.push(formatClassArmLabel(sa.classArm));
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            {profile.photoUrl ? (
              <Image
                src={profile.photoUrl}
                alt={profile.user.name}
                className="size-16 rounded-full image-border object-cover shrink-0"
                fill
              />
            ) : (
              <div className="size-16 rounded-full bg-deep-violet image-border text-primary-foreground flex items-center justify-center text-lg font-body font-medium shrink-0">
                {getInitials(profile.user.name)}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="font-sans font-semibold text-xl text-foreground truncate">
                {profile.user.name}
              </h1>
              <p className="font-body text-sm text-muted-foreground truncate">
                {profile.user.email}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-terracotta-pale text-primary">
                  {profile.employeeId}
                </span>
                {profile.designation && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-light-violet text-deep-violet">
                    {profile.designation}
                  </span>
                )}
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                    profile.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {profile.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setEditOpen(true)}
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body shrink-0 self-start sm:self-center"
          >
            <Pencil className="size-4" />
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Editable + admin-managed details */}
      <Card className="p-5">
        <h2 className="font-sans font-semibold text-lg text-foreground mb-4">
          Details
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <DetailField label="Phone" value={profile.phone} />
          <DetailField
            label="Date of birth"
            value={profile.dateOfBirth ? formatDate(profile.dateOfBirth) : null}
          />
          <DetailField label="Gender" value={profile.gender} />
          <DetailField label="Qualification" value={profile.qualification} />
          <DetailField label="Employment type" value={profile.employmentType} />
          <DetailField
            label="Date employed"
            value={
              profile.dateOfEmployment
                ? formatDate(profile.dateOfEmployment)
                : null
            }
          />
          <DetailField
            label="Address"
            value={profile.address}
            className="col-span-2 sm:col-span-3"
          />
        </div>
      </Card>

      {/* My Classes */}
      <Card className="p-5">
        <h2 className="font-sans font-semibold text-lg text-foreground mb-1">
          My Classes
        </h2>
        <p className="font-body text-xs text-muted-foreground mb-4">
          Classes where you are the class teacher
        </p>

        {classesLoading ? (
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        ) : classesError ? (
          <EmptyMessage error={classesError} />
        ) : !classes || classes.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">
            You&apos;re not a class teacher for any arm this session.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-body font-medium bg-terracotta-pale text-primary"
              >
                {formatClassArmLabel(c)}
                <span className="ml-1.5 text-xs text-primary/70">
                  ({c.capacity} seats)
                </span>
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* My Subjects */}
      <Card className="p-5">
        <h2 className="font-sans font-semibold text-lg text-foreground mb-1">
          My Subjects
        </h2>
        <p className="font-body text-xs text-muted-foreground mb-4">
          Subjects you teach, by class
        </p>

        {subjectsLoading ? (
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
        ) : subjectsError ? (
          <EmptyMessage error={subjectsError} />
        ) : Object.keys(subjectGroups).length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">
            You have no subject assignments yet this session.
          </p>
        ) : (
          <div className="space-y-3">
            {Object.entries(subjectGroups).map(([subjectId, group]) => (
              <div
                key={subjectId}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="font-body text-sm font-medium text-foreground min-w-32">
                  {group.name} ({group.code})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.classArms.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-light-violet text-deep-violet"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <EditProfileSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
      />
    </div>
  );
}

function DetailField({
  label,
  value,
  className,
}: {
  label: string;
  value: string | null | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground font-semibold capitalize tracking-wide">
        {label}
      </p>
      <p className="font-body text-sm text-foreground mt-0.5">
        {value || <span className="text-muted-foreground">Not set</span>}
      </p>
    </div>
  );
}

function EmptyMessage({ error }: { error: unknown }) {
  const message =
    error instanceof ApiError ? error.message : 'Something went wrong.';
  return <p className="font-body text-sm text-muted-foreground">{message}</p>;
}
