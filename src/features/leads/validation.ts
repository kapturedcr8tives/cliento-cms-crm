import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  value: z.coerce.number().min(0, { message: 'Value must be a positive number.' }),
  source: z.string().optional(),
  stage_id: z.string().uuid({ message: 'A valid stage must be selected.' }),
  // assigned_to_user_id could be added here as well
});

export type LeadFormValues = z.infer<typeof leadSchema>;
