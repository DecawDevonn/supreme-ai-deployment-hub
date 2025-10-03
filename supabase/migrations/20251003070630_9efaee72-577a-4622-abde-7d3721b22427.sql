-- Fix conversations table to prevent NULL user_id and orphaned records

-- First, delete any orphaned conversations with NULL user_id
-- These are inaccessible due to RLS policies anyway
DELETE FROM public.conversations
WHERE user_id IS NULL;

-- Now make user_id NOT NULL to enforce data integrity going forward
ALTER TABLE public.conversations
ALTER COLUMN user_id SET NOT NULL;