-- Create enum for auth types
CREATE TYPE public.auth_type AS ENUM ('api_key', 'oauth2', 'basic_auth', 'bearer_token');

-- Create api_connections table
CREATE TABLE public.api_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  auth_type public.auth_type NOT NULL,
  credentials JSONB NOT NULL,
  is_valid BOOLEAN NOT NULL DEFAULT false,
  last_validated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_name)
);

-- Enable RLS
ALTER TABLE public.api_connections ENABLE ROW LEVEL SECURITY;

-- Users can view their own API connections
CREATE POLICY "Users can view own api connections"
ON public.api_connections
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own API connections
CREATE POLICY "Users can create own api connections"
ON public.api_connections
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own API connections
CREATE POLICY "Users can update own api connections"
ON public.api_connections
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own API connections
CREATE POLICY "Users can delete own api connections"
ON public.api_connections
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_api_connections_updated_at
BEFORE UPDATE ON public.api_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_workflow_timestamp();

-- Create indexes for faster lookups
CREATE INDEX idx_api_connections_user_id ON public.api_connections(user_id);
CREATE INDEX idx_api_connections_service_name ON public.api_connections(service_name);
CREATE INDEX idx_api_connections_is_valid ON public.api_connections(is_valid);