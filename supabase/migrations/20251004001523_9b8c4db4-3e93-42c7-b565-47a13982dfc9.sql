-- Create workflows table
CREATE TABLE public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  definition JSONB NOT NULL DEFAULT '{}'::jsonb,
  executor TEXT NOT NULL DEFAULT 'supabase',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow_runs table
CREATE TABLE public.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed', 'cancelled')),
  logs JSONB NOT NULL DEFAULT '[]'::jsonb,
  input_params JSONB DEFAULT '{}'::jsonb,
  output_data JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workflows
CREATE POLICY "Users can view own workflows"
  ON public.workflows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workflows"
  ON public.workflows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workflows"
  ON public.workflows FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workflows"
  ON public.workflows FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for workflow_runs
CREATE POLICY "Users can view own workflow runs"
  ON public.workflow_runs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.workflows
    WHERE workflows.id = workflow_runs.workflow_id
    AND workflows.user_id = auth.uid()
  ));

CREATE POLICY "Users can create workflow runs"
  ON public.workflow_runs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.workflows
    WHERE workflows.id = workflow_runs.workflow_id
    AND workflows.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own workflow runs"
  ON public.workflow_runs FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.workflows
    WHERE workflows.id = workflow_runs.workflow_id
    AND workflows.user_id = auth.uid()
  ));

-- Trigger to update workflows updated_at
CREATE OR REPLACE FUNCTION public.update_workflow_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_workflow_timestamp();