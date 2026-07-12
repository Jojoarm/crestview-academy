'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { UnlinkParentDialog } from './UnlinkParentDialog';

export function ParentCard({
  studentId,
  parentId,
  name,
  email,
  relationship,
  isPrimary,
}: {
  studentId: string;
  parentId: string;
  name: string;
  email: string;
  relationship: string;
  isPrimary: boolean;
}) {
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4 bg-muted border border-border rounded">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-body text-sm font-medium text-foreground truncate">
            {name}
          </p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-background border border-border text-muted-foreground">
            {relationship}
          </span>
          {isPrimary && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium bg-terracotta-pale text-primary">
              Primary
            </span>
          )}
        </div>
        <p className="font-body text-xs text-muted-foreground truncate">
          {email}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="size-8 hover:bg-red-50 text-muted-foreground hover:text-red-500 shrink-0"
        onClick={() => setShowUnlinkDialog(true)}
      >
        <Trash2 className="size-3.5" />
      </Button>

      <UnlinkParentDialog
        open={showUnlinkDialog}
        onClose={() => setShowUnlinkDialog(false)}
        studentId={studentId}
        parentId={parentId}
        parentName={name}
      />
    </div>
  );
}
