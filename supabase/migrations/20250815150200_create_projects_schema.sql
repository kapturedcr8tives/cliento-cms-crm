-- Cliento CRM - Create Projects, Stages, and Tasks Schema
-- This migration adds the tables required for the project management feature.

-- 1. Create custom enum types
CREATE TYPE public.project_status AS ENUM (
    'not_started',
    'in_progress',
    'completed',
    'on_hold',
    'cancelled'
);

CREATE TYPE public.task_priority AS ENUM (
    'low',
    'medium',
    'high'
);


-- 2. Projects Table
CREATE TABLE public.projects (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
    name text NOT NULL,
    description text,
    status public.project_status NOT NULL DEFAULT 'not_started',
    start_date date,
    end_date date,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.projects IS 'Stores project information for each organization.';


-- 3. Project Stages Table
CREATE TABLE public.project_stages (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    position integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.project_stages IS 'Defines the columns for the task Kanban board within a project.';


-- 4. Tasks Table
CREATE TABLE public.tasks (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    stage_id uuid NOT NULL REFERENCES public.project_stages(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    priority public.task_priority NOT NULL DEFAULT 'medium',
    due_date date,
    assigned_to_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    position integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.tasks IS 'Stores individual tasks for a project.';


-- 5. RLS Policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage projects in their own organization"
ON public.projects FOR ALL USING (organization_id = get_my_organization_id());

ALTER TABLE public.project_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage project stages for projects in their org"
ON public.project_stages FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_stages.project_id AND p.organization_id = get_my_organization_id()
    )
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage tasks for projects in their org"
ON public.tasks FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = tasks.project_id AND p.organization_id = get_my_organization_id()
    )
);
