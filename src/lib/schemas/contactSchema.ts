import { z } from 'zod';

export const contactSubjects = [
  'General Enquiry',
  'Admissions',
  'Fees & Payments',
  'Student Welfare',
  'Events & Calendar',
  'Other',
] as const;

export const contactSchema = z.object({
  fullName: z.string().min(2, { message: 'Please enter your full name' }),
  email: z.email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  subject: z.enum(contactSubjects, {
    error: 'Please select a subject',
  }),
  message: z
    .string()
    .min(10, { message: 'Please enter a message (at least 10 characters)' }),
});

export type ContactSchemaType = z.infer<typeof contactSchema>;
