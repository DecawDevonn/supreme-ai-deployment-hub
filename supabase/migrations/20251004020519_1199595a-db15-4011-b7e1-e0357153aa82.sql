-- Create user_features table to track which modules users have enabled
CREATE TABLE public.user_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_name)
);

-- Enable RLS
ALTER TABLE public.user_features ENABLE ROW LEVEL SECURITY;

-- Users can view their own features
CREATE POLICY "Users can view own features"
ON public.user_features
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own features
CREATE POLICY "Users can insert own features"
ON public.user_features
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own features
CREATE POLICY "Users can update own features"
ON public.user_features
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_features_updated_at
BEFORE UPDATE ON public.user_features
FOR EACH ROW
EXECUTE FUNCTION public.update_workflow_timestamp();

-- Create index for faster lookups
CREATE INDEX idx_user_features_user_id ON public.user_features(user_id);
CREATE INDEX idx_user_features_feature_name ON public.user_features(feature_name);