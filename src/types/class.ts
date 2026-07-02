export type Section = 'Kindergarten' | 'Nursery' | 'Primary' | 'Secondary';

export const SECTIONS: Section[] = [
  'Nursery',
  'Kindergarten',
  'Primary',
  'Secondary',
];

export type Arm = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ClassArm = {
  id: string;
  capacity: number;
  classLevelId: string;
  armId: string;
  arm: Arm;
  createdAt: string;
  updatedAt: string;
};

export type ClassLevel = {
  id: string;
  name: string;
  section: Section;
  isActive: boolean;
  classArms: ClassArm[];
  totalCapacity: number;
  createdAt: string;
  updatedAt: string;
};
