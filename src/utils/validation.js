import { z } from 'zod';

const phoneRegex = /^\+?[0-9\-\s()]{7,15}$/;

export const registrationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  email: z.string().email('Invalid email address'),
  organization: z.string().min(2, 'Organization name is required'),
  role: z.enum(['Founder', 'Investor', 'Working Professional', 'Student', 'Other'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  })
});
