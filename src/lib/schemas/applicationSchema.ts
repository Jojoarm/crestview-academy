import { z } from 'zod';

export const applicantLevels = [
  'Kindergarten',
  'Nursery',
  'Primary',
  'Secondary',
] as const;

export const genders = ['Male', 'Female'] as const;

export const relationships = ['Father', 'Mother', 'Guardian'] as const;

export const applicationSchema = z.object({
  // ── Student details ──────────────────────────────────────────────
  studentFirstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters long' })
    .max(50, { message: 'First name must be at most 50 characters long' }),
  studentLastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters long' })
    .max(50, { message: 'Last name must be at most 50 characters long' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  gender: z.enum(genders, { message: 'Please select a gender' }),
  applyingForLevel: z.enum(applicantLevels, {
    message: 'Please select the level you are applying for',
  }),
  currentSchool: z
    .string()
    .max(100, { message: 'School name must be at most 100 characters long' })
    .optional(),

  // ── Parent / guardian details ────────────────────────────────────
  parentFullName: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters long' })
    .max(100, { message: 'Full name must be at most 100 characters long' }),
  relationshipToStudent: z.enum(relationships, {
    message: 'Please select your relationship to the student',
  }),
  parentEmail: z.email({ message: 'Please enter a valid email address' }),
  parentPhone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' }),
  homeAddress: z
    .string()
    .min(10, { message: 'Address must be at least 10 characters long' })
    .max(200, { message: 'Address must be at most 200 characters long' }),

  // ── Additional info ───────────────────────────────────────────────
  howDidYouHear: z
    .string()
    .max(100, { message: 'This field must be at most 100 characters long' })
    .optional(),
  additionalMessage: z
    .string()
    .max(500, { message: 'Message must be at most 500 characters long' })
    .optional(),
});

export type ApplicationSchemaType = z.infer<typeof applicationSchema>;
