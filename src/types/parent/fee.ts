export type FeeFrequency = 'Annual' | 'PerTerm';

export interface FeeLineItem {
  id: string;
  amount: string;
  feeType: {
    name: string;
    description: string | null;
    frequency: FeeFrequency;
    isOptional: boolean;
  };
  session: { name: string } | null;
  term: { name: string } | null;
}

export interface ChildFeesResponse {
  classArm: { classLevel: string; arm: string };
  fees: {
    annual: FeeLineItem[];
    perTerm: FeeLineItem[];
  };
}
