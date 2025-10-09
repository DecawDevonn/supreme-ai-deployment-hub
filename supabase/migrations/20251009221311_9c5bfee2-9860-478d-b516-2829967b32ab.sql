-- Final security fix: Restrict SELECT on api_connections table
-- Remove the old policy that allowed SELECT on all columns
DROP POLICY IF EXISTS "Users can view own api connections metadata" ON api_connections;

-- Create a new policy that explicitly denies SELECT from clients
-- The edge function uses service role key which bypasses RLS
-- Clients should use api_connections_metadata view instead
CREATE POLICY "Clients cannot directly select from api_connections"
ON api_connections
FOR SELECT
USING (false);

-- Add a comment explaining the security model
COMMENT ON TABLE api_connections IS 
'Stores encrypted API credentials. Direct SELECT is blocked by RLS. 
Use api_connections_metadata view for metadata access.
Credentials are only accessible via api-connections edge function with service role key.';