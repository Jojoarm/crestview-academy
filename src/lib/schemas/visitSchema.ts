import { z } from 'zod';

export const visitInterests = [
  'Kindergarten',
  'Nursery',
  'Primary',
  'Secondary',
  'Not Sure Yet',
] as const;

export const preferredTimes = [
  'Morning (9am - 11am)',
  'Midday (11am - 1pm)',
  'Afternoon (1pm - 3pm)',
] as const;

export const visitSchema = z.object({
  parentFullName: z.string().min(2, { message: 'Please enter your full name' }),
  parentEmail: z.email({ message: 'Please enter a valid email address' }),
  parentPhone: z
    .string()
    .min(7, { message: 'Please enter a valid phone number' }),
  childAgeOrLevel: z.enum(visitInterests, {
    error: 'Please select a level',
  }),
  preferredDate: z
    .string()
    .min(1, { message: 'Please select a preferred date' }),
  preferredTime: z.enum(preferredTimes, {
    error: 'Please select a preferred time',
  }),
  additionalNotes: z.string().optional(),
});

// Validated output type — used after successful submission
export type VisitSchemaType = z.infer<typeof visitSchema>;
