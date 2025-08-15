import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(2, { message: 'Project name must be at least 2 characters.' }),
  description: z.string().optional(),
  client_id: z.string().uuid().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled']),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;


export const taskSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
    description: z.string().optional(),
    stage_id: z.string().uuid({ message: 'A valid stage must be selected.' }),
    priority: z.enum(['low', 'medium', 'high']),
    due_date: z.string().optional().nullable(),
    assigned_to_user_id: z.string().uuid().optional().nullable(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
