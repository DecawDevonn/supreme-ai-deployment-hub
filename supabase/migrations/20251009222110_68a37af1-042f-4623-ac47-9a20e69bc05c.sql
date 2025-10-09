-- Fix: Set view to SECURITY INVOKER mode to respect RLS policies
-- This resolves the security definer view warning

-- Drop and recreate the view with security_invoker enabled
DROP VIEW IF EXISTS public.api_connections_metadata;

CREATE VIEW public.api_connections_metadata
WITH (security_invoker=on, security_barrier=true)
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

COMMENT ON VIEW public.api_connections_metadata IS 
'Safe view of API connection metadata without credentials. 
Uses SECURITY INVOKER mode to respect RLS policies from api_connections table.
Credentials column is excluded to prevent exposure to clients.';