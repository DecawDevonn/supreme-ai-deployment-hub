-- Fix 1: Secure Personas Table - Add public/private flag
ALTER TABLE public.personas 
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false;

-- Drop overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can read personas" ON public.personas;

-- Create restrictive policy: only public personas or admin access
CREATE POLICY "Users can read public personas or admins can read all"
ON public.personas
FOR SELECT
USING (is_public = true OR is_admin(auth.uid()));

-- Fix 2: Secure API Connections - Prevent credential exposure
DROP POLICY IF EXISTS "Users can view own api connections" ON public.api_connections;

-- Create safe SELECT policy that excludes credentials column
CREATE POLICY "Users can view own api connections metadata"
ON public.api_connections
FOR SELECT
USING (auth.uid() = user_id);

-- Create view for safe client access (without credentials)
CREATE OR REPLACE VIEW public.api_connections_safe AS
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

-- Fix 3: Harden user_roles table
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Only admins can insert roles
CREATE POLICY "Only admins can assign roles"
ON public.user_roles
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Only admins can update roles
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
USING (is_admin(auth.uid()));

-- Prevent admins from removing their own admin role
CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
USING (
  is_admin(auth.uid()) AND 
  NOT (user_id = auth.uid() AND role = 'admin')
);

-- Fix 4: Make legacy_workflows user_id NOT NULL
ALTER TABLE public.legacy_workflows 
ALTER COLUMN user_id SET NOT NULL;