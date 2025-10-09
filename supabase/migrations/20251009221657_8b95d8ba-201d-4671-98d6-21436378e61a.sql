-- Secure metadata exposure for API connections without exposing credentials
-- 1) Create SECURITY DEFINER function that enforces per-user filtering
CREATE OR REPLACE FUNCTION public.get_api_connections_metadata()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  service_name text,
  auth_type public.auth_type,
  is_valid boolean,
  last_validated_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ac.id,
    ac.user_id,
    ac.service_name,
    ac.auth_type,
    ac.is_valid,
    ac.last_validated_at,
    ac.created_at,
    ac.updated_at
  FROM public.api_connections ac
  WHERE ac.user_id = auth.uid()
$$;

COMMENT ON FUNCTION public.get_api_connections_metadata() IS 'Returns API connection metadata for the current user. Credentials are excluded. Enforces user scoping with auth.uid() inside a SECURITY DEFINER function.';

-- 2) Replace the api_connections_metadata view to use the secure function
DROP VIEW IF EXISTS public.api_connections_metadata;

CREATE VIEW public.api_connections_metadata AS
SELECT * FROM public.get_api_connections_metadata();

COMMENT ON VIEW public.api_connections_metadata IS 'Per-user safe view over API connection metadata (no credentials). Backed by a SECURITY DEFINER function enforcing auth.uid().';

-- 3) Tighten privileges: deny public, allow only authenticated and service role
REVOKE ALL ON public.api_connections_metadata FROM PUBLIC;
GRANT SELECT ON public.api_connections_metadata TO authenticated;
GRANT SELECT ON public.api_connections_metadata TO service_role;

REVOKE ALL ON FUNCTION public.get_api_connections_metadata() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_api_connections_metadata() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_api_connections_metadata() TO service_role;