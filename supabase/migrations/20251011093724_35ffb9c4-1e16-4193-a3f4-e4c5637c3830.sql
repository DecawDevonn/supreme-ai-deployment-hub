-- Create atomic function to claim first admin privileges
-- This prevents race conditions where multiple users could claim admin simultaneously
CREATE OR REPLACE FUNCTION public.claim_first_admin(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count integer;
BEGIN
  -- Lock the table to prevent concurrent claims
  LOCK TABLE public.user_roles IN EXCLUSIVE MODE;
  
  -- Count existing admins
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin';
  
  -- Only insert if no admins exist
  IF admin_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin');
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;