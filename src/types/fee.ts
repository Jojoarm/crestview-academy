export type FeeFrequency = 'OneTime' | 'Annual' | 'PerTerm';
export type FeeScope = 'SchoolWide' | 'PerClass';

export const FEE_FREQUENCIES: FeeFrequency[] = ['OneTime', 'Annual', 'PerTerm'];
export const FEE_SCOPES: FeeScope[] = ['SchoolWide', 'PerClass'];

export const FREQUENCY_LABELS: Record<FeeFrequency, string> = {
  OneTime: 'One Time',
  Annual: 'Annual',
  PerTerm: 'Per Term',
};

export const SCOPE_LABELS: Record<FeeScope, string> = {
  SchoolWide: 'School Wide',
  PerClass: 'Per Class',
};

export type FeeType = {
  id: string;
  name: string;
  description?: string | null;
  frequency: FeeFrequency;
  scope: FeeScope;
  isOptional: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FeeStructureFeeType = {
  id: string;
  name: string;
  frequency: FeeFrequency;
  scope: FeeScope;
  isOptional: boolean;
  isActive: boolean;
  description: string | null;
};

export type FeeStructureClassLevel = {
  id: string;
  name: string;
  section: string;
  isActive: boolean;
};

export type FeeStructureSession = {
  id: string;
  name: string;
  isActive: boolean;
};

export type FeeStructureTerm = {
  id: string;
  name: string;
  isActive: boolean;
};

export type FeeStructure = {
  id: string;
  amount: string;
  isActive: boolean;
  feeTypeId: string;
  classLevelId: string | null;
  sessionId: string | null;
  termId: string | null;
  feeType: FeeStructureFeeType;
  classLevel: FeeStructureClassLevel | null;
  session: FeeStructureSession | null;
  term: FeeStructureTerm | null;
  createdAt: string;
  updatedAt: string;
};

export type ApplicableFeesResponse = {
  oneTime: FeeStructure[];
  annual: FeeStructure[];
  perTerm: FeeStructure[];
};

// Determine which fields are required based on frequency + scope
export function getRequiredFields(frequency: FeeFrequency, scope: FeeScope) {
  return {
    needsClassLevel: scope === 'PerClass',
    needsSession: frequency === 'Annual' || frequency === 'PerTerm',
    needsTerm: frequency === 'PerTerm',
  };
}
