-- Fix the security definer view issue
-- Drop and recreate view with SECURITY INVOKER
DROP VIEW IF EXISTS public.api_connections_safe;

CREATE OR REPLACE VIEW public.api_connections_safe
WITH (security_invoker = true)
AS
SELECT 
  id,
  user_id,
  service_name,
  auth_type,
  is_valid,
  last_validated_at,
  created_at,
  updated_at
FROM public.api_connections;