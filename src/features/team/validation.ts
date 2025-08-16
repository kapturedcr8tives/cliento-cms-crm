import { z } from 'zod';

// This corresponds to the user_role enum in the database
export const userRoleEnum = z.enum(['ORG_ADMIN', 'TEAM_MEMBER', 'CLIENT']);

// Schema for the "Invite User" form
export const inviteUserSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  role: userRoleEnum,
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

// A client-side type definition for a team member
// This would typically be derived from the API response
export type TeamMember = {
    id: string;
    email: string;
    full_name: string | null;
    role: z.infer<typeof userRoleEnum>;
    // You could add other fields like avatar_url, last_login, etc.
};
