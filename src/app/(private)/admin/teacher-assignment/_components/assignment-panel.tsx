'use client';

import { useArmTeachers } from '@/hooks/admin/use-teacher-assignments';
import { ClassTeachersSection } from './class-teachers-section';
import { SubjectTeachersSection } from './subject-teachers-section';

type Props = {
  classArmId: string;
  label: string;
  section: string;
};

export function AssignmentPanel({ classArmId, label, section }: Props) {
  const { data, isLoading } = useArmTeachers(classArmId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="bg-card/40 border border-border p-5">
            <div className="flex flex-col gap-3">
              <div className="h-5 w-40 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-sans font-semibold text-lg text-foreground">
        {label}
      </h2>

      <ClassTeachersSection
        classArmId={classArmId}
        classTeachers={data?.classTeachers ?? []}
      />

      <SubjectTeachersSection
        classArmId={classArmId}
        subjectTeachers={data?.subjectTeachers ?? []}
        section={section}
      />
    </div>
  );
}
