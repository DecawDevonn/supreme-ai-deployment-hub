-- Create audit log table for secure metadata storage
CREATE TABLE IF NOT EXISTS public.api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    event_type TEXT NOT NULL,
    details JSONB
);

-- Enable Row Level Security
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own usage logs" 
ON public.api_usage_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage logs"
ON public.api_usage_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RPC function to log usage data securely
CREATE OR REPLACE FUNCTION public.log_api_usage(event_type_in TEXT, details_in JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.api_usage_logs (user_id, event_type, details)
    VALUES (auth.uid(), event_type_in, details_in);
END;
$$;