'use client';

import { useRouter } from 'next/navigation';
import { FileText, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ReportCardLinkCard({ studentId }: { studentId: string }) {
  const router = useRouter();

  return (
    <Card
      className="p-5 flex items-center gap-4 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all group"
      onClick={() =>
        router.push(`/admin/users/students/${studentId}/report-card`)
      }
    >
      <div className="flex items-center justify-center size-11 rounded-xl bg-terracotta-pale text-primary shrink-0">
        <FileText className="size-5" />
      </div>

      <div className="min-w-0 flex-1 text-center">
        <p className="font-body text-sm font-semibold text-foreground">
          Report Cards
        </p>
        <p className="font-body text-xs text-muted-foreground mt-0.5">
          View scores, attendance, and remark by term
        </p>
      </div>

      <ChevronRight className="size-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
    </Card>
  );
}
