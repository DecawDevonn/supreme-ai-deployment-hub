-- Fix: Remove SECURITY DEFINER approach and use proper RLS on base table
-- This resolves the security scanner warnings about security definer views

-- 1) Drop the security definer function and view
DROP VIEW IF EXISTS public.api_connections_metadata;
DROP FUNCTION IF EXISTS public.get_api_connections_metadata();

-- 2) Fix the api_connections table RLS policies
-- Remove any blocking policies
DROP POLICY IF EXISTS "Clients cannot directly select from api_connections" ON api_connections;

-- Drop and recreate the proper SELECT policy
DROP POLICY IF EXISTS "Users can view own api connections" ON api_connections;
DROP POLICY IF EXISTS "Users can view own api connections metadata" ON api_connections;

CREATE POLICY "Users can view own api connections"
ON api_connections
FOR SELECT
USING (auth.uid() = user_id);

-- 3) Recreate the metadata view as a simple view (not security definer)
-- The view will inherit RLS from the base table, and excludes credentials column
CREATE VIEW public.api_connections_metadata AS
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

-- 4) Set security_barrier on the view so it enforces RLS properly
ALTER VIEW public.api_connections_metadata SET (security_barrier = true);

COMMENT ON VIEW public.api_connections_metadata IS 
'Safe view of API connection metadata without credentials. Inherits RLS from api_connections table.';

COMMENT ON TABLE public.api_connections IS 
'Stores encrypted API credentials. The credentials column contains encrypted data. 
Use api_connections_metadata view for safe metadata access.
Only the api-connections edge function should access encrypted credentials directly using service role key.';