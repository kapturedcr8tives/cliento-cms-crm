-- Cliento CRM - Create Clients Table Schema
-- This migration adds the core `clients` table for managing customer data.

-- 1. Create a custom type for client status
CREATE TYPE public.client_status AS ENUM (
    'active',
    'inactive',
    'archived'
);

-- 2. Create the Clients Table
CREATE TABLE public.clients (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    phone text,
    address text,
    status public.client_status NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    -- A client's email must be unique within their organization.
    CONSTRAINT client_organization_email_unique UNIQUE (organization_id, email)
);

COMMENT ON TABLE public.clients IS 'Stores client information for each organization.';
COMMENT ON COLUMN public.clients.organization_id IS 'The organization this client belongs to.';

-- 3. Row-Level Security (RLS) for Clients Table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Helper function to get the organization ID of the currently authenticated user
CREATE OR REPLACE FUNCTION get_my_organization_id()
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT organization_id FROM public.profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Policy: Allow users to view clients in their own organization.
CREATE POLICY "Users can view clients in their own organization"
ON public.clients FOR SELECT
USING (organization_id = get_my_organization_id());

-- Policy: Allow users to insert clients into their own organization.
CREATE POLICY "Users can create clients for their own organization"
ON public.clients FOR INSERT
WITH CHECK (organization_id = get_my_organization_id());

-- Policy: Allow users to update clients in their own organization.
CREATE POLICY "Users can update clients in their own organization"
ON public.clients FOR UPDATE
USING (organization_id = get_my_organization_id());

-- Policy: Allow users to delete clients in their own organization.
CREATE POLICY "Users can delete clients from their own organization"
ON public.clients FOR DELETE
USING (organization_id = get_my_organization_id());
