-- Secure the api_connections_metadata view by removing public access
-- This fixes the public exposure of user service connection data

-- Remove ALL privileges for the view from all roles first
REVOKE ALL ON public.api_connections_metadata FROM PUBLIC;
REVOKE ALL ON public.api_connections_metadata FROM anon;
REVOKE ALL ON public.api_connections_metadata FROM authenticated;
REVOKE ALL ON public.api_connections_metadata FROM service_role;

-- Grant appropriate access only to authenticated users and service role
-- The view already uses security_invoker=on so it will respect the RLS policies
-- from the underlying api_connections table
GRANT SELECT ON public.api_connections_metadata TO authenticated;
GRANT SELECT ON public.api_connections_metadata TO service_role;

-- Add a comment explaining the security model
COMMENT ON VIEW public.api_connections_metadata IS 
'Secure view of API connection metadata without credentials. 
Uses SECURITY INVOKER mode to respect RLS policies from api_connections table.
Access restricted to authenticated users only.
Credentials column is excluded to prevent exposure to clients.';