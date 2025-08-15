-- Cliento CRM - Create Leads and Lead Stages Schema
-- This migration adds the tables required for the lead management and sales pipeline feature.

-- 1. Lead Stages Table
-- Defines the columns (stages) of the sales pipeline for each organization.
CREATE TABLE public.lead_stages (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    position integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT lead_stages_organization_name_unique UNIQUE (organization_id, name)
);

COMMENT ON TABLE public.lead_stages IS 'Defines the stages of the sales pipeline for an organization.';
COMMENT ON COLUMN public.lead_stages.position IS 'The order of the stage in the pipeline view.';


-- 2. Leads Table
-- Stores individual leads for an organization.
CREATE TABLE public.leads (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    stage_id uuid REFERENCES public.lead_stages(id) ON DELETE SET NULL,
    name text NOT NULL,
    email text,
    phone text,
    value numeric(10, 2) DEFAULT 0.00,
    source text,
    assigned_to_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    position integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.leads IS 'Stores lead information for each organization.';
COMMENT ON COLUMN public.leads.stage_id IS 'The current stage of the lead in the sales pipeline.';
COMMENT ON COLUMN public.leads.position IS 'The order of the lead within its stage column.';


-- 3. RLS Policies for Lead Stages
ALTER TABLE public.lead_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view lead stages in their own organization"
ON public.lead_stages FOR SELECT
USING (organization_id = get_my_organization_id());

CREATE POLICY "Users can manage lead stages in their own organization"
ON public.lead_stages FOR ALL
USING (organization_id = get_my_organization_id());


-- 4. RLS Policies for Leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view leads in their own organization"
ON public.leads FOR SELECT
USING (organization_id = get_my_organization_id());

CREATE POLICY "Users can manage leads in their own organization"
ON public.leads FOR ALL
USING (organization_id = get_my_organization_id());
