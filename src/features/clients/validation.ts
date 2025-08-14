import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived']),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
