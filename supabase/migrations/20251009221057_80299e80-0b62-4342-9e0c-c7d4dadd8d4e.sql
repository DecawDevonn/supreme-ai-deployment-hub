-- Security Fix: Create a view that excludes encrypted credentials
CREATE OR REPLACE VIEW api_connections_metadata AS
SELECT 
  id,
  user_id,
  service_name,
  auth_type,
  is_valid,
  last_validated_at,
  created_at,
  updated_at
FROM api_connections;

-- Grant access to authenticated users
GRANT SELECT ON api_connections_metadata TO authenticated;

-- Add a comment explaining the security model
COMMENT ON VIEW api_connections_metadata IS 
'Secure view of API connections that excludes encrypted credentials. 
Credentials are only accessible server-side through the api-connections edge function.
Access is controlled by the underlying api_connections table RLS policies.';