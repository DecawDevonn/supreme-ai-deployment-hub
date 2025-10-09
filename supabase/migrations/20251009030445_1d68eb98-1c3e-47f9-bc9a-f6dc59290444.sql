-- Create legacy_workflows table for workflow metadata and annotations
CREATE TABLE public.legacy_workflows (
  workflow_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  path TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.legacy_workflows ENABLE ROW LEVEL SECURITY;

-- Policies for legacy_workflows
CREATE POLICY "Users can view own legacy workflows"
  ON public.legacy_workflows
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own legacy workflows"
  ON public.legacy_workflows
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own legacy workflows"
  ON public.legacy_workflows
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own legacy workflows"
  ON public.legacy_workflows
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_legacy_workflows_timestamp
  BEFORE UPDATE ON public.legacy_workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_workflow_timestamp();

-- Create index for faster queries
CREATE INDEX idx_legacy_workflows_user_id ON public.legacy_workflows(user_id);
CREATE INDEX idx_legacy_workflows_category ON public.legacy_workflows(category);
CREATE INDEX idx_legacy_workflows_tags ON public.legacy_workflows USING GIN(tags);