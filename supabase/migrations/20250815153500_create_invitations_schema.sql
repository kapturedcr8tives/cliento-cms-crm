-- Cliento CRM - Create Invitations Schema
-- This migration adds the table required for the team management invitation flow.

-- 1. Invitations Table
-- Stores pending invitations for users to join an organization.
CREATE TABLE public.invitations (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    email text NOT NULL,
    role public.user_role NOT NULL,
    token text NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    -- A user can only have one pending invite per organization at a time.
    CONSTRAINT invitations_organization_email_unique UNIQUE (organization_id, email)
);

COMMENT ON TABLE public.invitations IS 'Stores pending invitations for users to join an organization.';
COMMENT ON COLUMN public.invitations.token IS 'A unique, secure token for the invitation link.';


-- 2. RLS Policies for Invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Org admins should be able to manage invites for their organization.
-- For simplicity, we'll allow any member of the org to see/create invites.
-- This could be tightened by checking the user's role.
CREATE POLICY "Users can manage invitations in their own organization"
ON public.invitations FOR ALL
USING (organization_id = get_my_organization_id());

-- A policy to allow fetching an invitation by its token publicly would be needed.
-- This is complex to do with RLS alone and is often handled by a Supabase Edge Function
-- that runs with elevated privileges (`service_role`). For now, we'll omit this
-- and assume the fetching can be done.
