import { z } from 'zod';

export const issueTypes = [
  'Login Issues',
  'Email & Communication',
  'Student Result Access',
  'Fee Payment Portal',
  'School App / Mobile',
  'Device & Hardware',
  'Other Technical Issue',
] as const;

export const userTypes = ['Parent', 'Student', 'Staff'] as const;

export const itSupportSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name' }),
  email: z.email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  userType: z.enum(userTypes, {
    error: 'Please select who you are',
  }),
  issueType: z.enum(issueTypes, {
    error: 'Please select an issue type',
  }),
  description: z.string().min(20, {
    message: 'Please describe the issue in at least 20 characters',
  }),
});

export type ITSupportSchemaType = z.infer<typeof itSupportSchema>;
