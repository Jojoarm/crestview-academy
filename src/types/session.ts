export type Term = {
  id: string;
  name: 'First' | 'Second' | 'Third';
  startDate: string;
  endDate: string;
  isActive: boolean;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
};

export type AcademicSession = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  terms: Term[];
  createdAt: string;
  updatedAt: string;
};

export const TERM_NAMES = ['First', 'Second', 'Third'] as const;
export type TermName = (typeof TERM_NAMES)[number];
