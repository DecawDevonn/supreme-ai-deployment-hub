-- Fix persona_prompts RLS policies to restrict access properly
DROP POLICY IF EXISTS "Authenticated users can read persona_prompts" ON public.persona_prompts;

-- Only admins or users viewing public personas can read prompts
CREATE POLICY "Users can read prompts for public personas or admins can read all"
ON public.persona_prompts
FOR SELECT
USING (
  is_admin(auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM public.personas 
    WHERE personas.persona_id = persona_prompts.persona_id 
    AND personas.is_public = true
  )
);

-- Remove the unused api_connections_safe view as it's not being used and creates confusion
DROP VIEW IF EXISTS public.api_connections_safe;