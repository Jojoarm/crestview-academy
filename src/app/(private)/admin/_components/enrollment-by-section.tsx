'use client';

import { Card } from '@/components/ui/card';

type SectionData = {
  Kindergarten: number;
  Nursery: number;
  Primary: number;
  Secondary: number;
};

type Props = {
  bySection?: SectionData;
  sessionName?: string;
  isLoading: boolean;
};

const SECTION_COLORS: Record<keyof SectionData, string> = {
  Nursery: 'bg-violet',
  Kindergarten: 'bg-ember',
  Primary: 'bg-deep-violet',
  Secondary: 'bg-sage',
};

const SECTION_BG: Record<keyof SectionData, string> = {
  Nursery: 'bg-violet/10 text-violet',
  Kindergarten: 'bg-ember/10 text-ember',
  Primary: 'bg-deep-violet/10 text-deep-violet',
  Secondary: 'bg-sage/20 text-foreground-100',
};

export function EnrollmentBySection({
  bySection,
  sessionName,
  isLoading,
}: Props) {
  const sections = ['Nursery', 'Kindergarten', 'Primary', 'Secondary'] as const;
  const total = bySection
    ? Object.values(bySection).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-semibold text-base text-foreground">
            Enrollment by Section
          </h2>
          {sessionName && (
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              {sessionName}
            </p>
          )}
        </div>
        {!isLoading && (
          <p className="font-body text-xs text-muted-foreground">
            {total.toLocaleString()} total
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : total === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-4 text-center">
          No enrollments yet for this session.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sections.map((section) => {
            const count = bySection?.[section] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div
                key={section}
                className="flex flex-col gap-2 p-4 bg-muted/60 image-border rounded"
              >
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium w-fit ${SECTION_BG[section]}`}
                >
                  {section}
                </span>
                <p className="font-sans font-bold text-2xl text-foreground tabular-nums leading-none">
                  {count.toLocaleString()}
                </p>
                <div className="flex flex-col gap-1">
                  <div className="h-1.5 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${SECTION_COLORS[section]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="font-body text-xs text-muted-foreground">
                    {pct}% of total
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
