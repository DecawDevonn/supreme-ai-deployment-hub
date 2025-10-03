-- ====================================================================
-- SECURITY FIX: Implement Proper RLS Policies for All Tables
-- ====================================================================

-- Step 1: Create user_roles system for admin management
-- ====================================================================

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can manage roles (we'll manually insert the first admin)
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- Step 2: Lock down personas table
-- ====================================================================

-- Drop existing public policies
DROP POLICY IF EXISTS "Allow public read access to personas" ON public.personas;
DROP POLICY IF EXISTS "Allow public insert to personas" ON public.personas;
DROP POLICY IF EXISTS "Allow public update to personas" ON public.personas;
DROP POLICY IF EXISTS "Allow public delete to personas" ON public.personas;

-- All authenticated users can read personas
CREATE POLICY "Authenticated users can read personas"
ON public.personas
FOR SELECT
TO authenticated
USING (true);

-- Only admins can create/update/delete personas
CREATE POLICY "Admins can manage personas"
ON public.personas
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update personas"
ON public.personas
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete personas"
ON public.personas
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Step 3: Lock down persona_prompts table
-- ====================================================================

-- Drop existing public policies
DROP POLICY IF EXISTS "Allow public read access to persona_prompts" ON public.persona_prompts;
DROP POLICY IF EXISTS "Allow public insert to persona_prompts" ON public.persona_prompts;
DROP POLICY IF EXISTS "Allow public update to persona_prompts" ON public.persona_prompts;
DROP POLICY IF EXISTS "Allow public delete to persona_prompts" ON public.persona_prompts;

-- All authenticated users can read persona prompts
CREATE POLICY "Authenticated users can read persona_prompts"
ON public.persona_prompts
FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage persona prompts
CREATE POLICY "Admins can manage persona_prompts"
ON public.persona_prompts
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update persona_prompts"
ON public.persona_prompts
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete persona_prompts"
ON public.persona_prompts
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Step 4: Add missing UPDATE/DELETE policies for knowledge_graph_entities
-- ====================================================================

CREATE POLICY "Users can update KG entities in own conversations"
ON public.knowledge_graph_entities
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = knowledge_graph_entities.conversation_id
      AND conversations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete KG entities in own conversations"
ON public.knowledge_graph_entities
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = knowledge_graph_entities.conversation_id
      AND conversations.user_id = auth.uid()
  )
);

-- Step 5: Add missing UPDATE/DELETE policies for knowledge_graph_relationships
-- ====================================================================

CREATE POLICY "Users can update KG relationships in own conversations"
ON public.knowledge_graph_relationships
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = knowledge_graph_relationships.conversation_id
      AND conversations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete KG relationships in own conversations"
ON public.knowledge_graph_relationships
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = knowledge_graph_relationships.conversation_id
      AND conversations.user_id = auth.uid()
  )
);

-- Step 6: Add missing UPDATE/DELETE policies for chat_messages
-- ====================================================================

CREATE POLICY "Users can update messages in own conversations"
ON public.chat_messages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = chat_messages.conversation_id
      AND conversations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete messages in own conversations"
ON public.chat_messages
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = chat_messages.conversation_id
      AND conversations.user_id = auth.uid()
  )
);

-- ====================================================================
-- IMPORTANT: Manual step required after migration
-- ====================================================================
-- After this migration runs, you need to manually assign admin role to your user:
-- 
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('your-user-id-here', 'admin')
-- 
-- You can find your user_id by running:
-- SELECT id, email FROM auth.users;
-- ====================================================================