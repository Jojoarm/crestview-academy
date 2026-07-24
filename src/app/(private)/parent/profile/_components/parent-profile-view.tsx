'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Users, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { cn, getInitials } from '@/lib/utils';
import { useParentProfile } from '@/hooks/parent/use-parent-profile';

import { EditParentProfileSheet } from './edit-parent-profile-sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DetailField } from '@/components/DetailField';

export function ParentProfileView() {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const { data: profile, isLoading } = useParentProfile();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="size-16 image-border shrink-0">
              <AvatarImage
                src={profile.photoUrl ?? undefined}
                alt={profile.user.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-sage image-border text-primary-foreground text-lg font-body font-medium">
                {getInitials(profile.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="font-sans font-semibold text-xl text-foreground truncate">
                {profile.user.name}
              </h1>
              <p className="font-body text-sm text-muted-foreground truncate">
                {profile.user.email}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {profile.occupation && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-light-violet text-deep-violet">
                    {profile.occupation}
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

      {/* Details */}
      <Card className="p-5">
        <h2 className="font-sans font-semibold text-lg text-foreground mb-4">
          Details
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <DetailField label="Phone" value={profile.phone} />
          <DetailField label="Occupation" value={profile.occupation} />
          <DetailField
            label="Address"
            value={profile.address}
            className="col-span-2 sm:col-span-3"
          />
        </div>
      </Card>

      {/* Quick link to Children */}
      <button
        type="button"
        onClick={() => router.push('/parent/children')}
        className="flex w-full items-center gap-3.5 rounded-xl border border-border bg-card/60 p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="p-2 rounded-xl bg-terracotta-pale text-primary shrink-0">
          <Users className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-sans font-semibold text-sm text-foreground">
            My Children
          </p>
          <p className="font-body text-xs text-muted-foreground">
            View and manage your linked children
          </p>
        </div>
        <ChevronRight className="size-4 text-muted-foreground shrink-0" />
      </button>

      <EditParentProfileSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
      />
    </div>
  );
}
