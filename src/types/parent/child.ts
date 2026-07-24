export type Relationship = 'Father' | 'Mother' | 'Guardian';
export type Gender = 'Male' | 'Female';

export interface ChildSummary {
  studentId: string;
  admissionNumber: string;
  name: string;
  photoUrl: string | null;
  relationship: Relationship;
  isPrimary: boolean;
  currentClass: { classLevel: string; arm: string } | null;
}

export interface ChildProfile extends ChildSummary {
  dateOfBirth: string | null;
  gender: Gender | null;
  address: string | null;
  bloodGroup: string | null;
  genotype: string | null;
  medicalConditions: string | null;
}

export function formatChildClass(
  currentClass: { classLevel: string; arm: string } | null,
): string {
  return currentClass
    ? `${currentClass.classLevel} ${currentClass.arm}`
    : 'Not yet enrolled this session';
}

export const RELATIONSHIP_COLORS: Record<Relationship, string> = {
  Father: 'bg-light-violet text-deep-violet',
  Mother: 'bg-terracotta-pale text-primary',
  Guardian: 'bg-muted text-muted-foreground',
};
