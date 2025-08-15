-- Cliento CRM - Create Contracts Schema
-- This migration adds the table required for the contract management feature.

-- 1. Create custom enum type for contract status
CREATE TYPE public.contract_status AS ENUM (
    'draft',
    'sent',
    'signed',
    'rejected',
    'expired'
);

-- 2. Contracts Table
CREATE TABLE public.contracts (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
    name text NOT NULL,
    content jsonb,
    status public.contract_status NOT NULL DEFAULT 'draft',
    sent_at timestamptz,
    signed_at timestamptz,
    start_date date,
    end_date date,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.contracts IS 'Stores contract information for each organization.';
COMMENT ON COLUMN public.contracts.content IS 'Stores contract content as JSON from a rich text editor.';


-- 3. RLS Policies for Contracts
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage contracts in their own organization"
ON public.contracts FOR ALL
USING (organization_id = get_my_organization_id());
