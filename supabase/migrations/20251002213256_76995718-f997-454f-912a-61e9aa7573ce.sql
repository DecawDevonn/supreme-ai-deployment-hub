-- Create personas table
CREATE TABLE IF NOT EXISTS public.personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  archetype TEXT,
  identity JSONB DEFAULT '{}'::jsonb,
  traits JSONB DEFAULT '{}'::jsonb,
  skills JSONB DEFAULT '{}'::jsonb,
  boundaries JSONB DEFAULT '{}'::jsonb,
  memory_hooks JSONB DEFAULT '{}'::jsonb,
  raw_schema JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create persona_prompts table for cached prompts
CREATE TABLE IF NOT EXISTS public.persona_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id TEXT UNIQUE NOT NULL REFERENCES public.personas(persona_id) ON DELETE CASCADE,
  system_prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_personas_persona_id ON public.personas(persona_id);
CREATE INDEX IF NOT EXISTS idx_persona_prompts_persona_id ON public.persona_prompts(persona_id);

-- Enable RLS
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_prompts ENABLE ROW LEVEL SECURITY;

-- Policies for personas (public read, admin write)
CREATE POLICY "Allow public read access to personas"
ON public.personas
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert to personas"
ON public.personas
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update to personas"
ON public.personas
FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete to personas"
ON public.personas
FOR DELETE
USING (true);

-- Policies for persona_prompts (public read, admin write)
CREATE POLICY "Allow public read access to persona_prompts"
ON public.persona_prompts
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert to persona_prompts"
ON public.persona_prompts
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update to persona_prompts"
ON public.persona_prompts
FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete to persona_prompts"
ON public.persona_prompts
FOR DELETE
USING (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_persona_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_personas_timestamp
BEFORE UPDATE ON public.personas
FOR EACH ROW
EXECUTE FUNCTION public.update_persona_timestamp();

CREATE TRIGGER update_persona_prompts_timestamp
BEFORE UPDATE ON public.persona_prompts
FOR EACH ROW
EXECUTE FUNCTION public.update_persona_timestamp();

-- Insert default personas
INSERT INTO public.personas (persona_id, name, role, archetype, identity, traits, skills, boundaries, memory_hooks, raw_schema)
VALUES 
(
  'mentor_persona',
  'The Mentor',
  'Guide, teacher, and supporter',
  'Wise Sage',
  '{"age": 45, "profession": "Mentor", "backstory": "A lifelong learner guiding others to their potential."}'::jsonb,
  '{"personality": ["compassionate", "curious", "patient"], "communication_style": {"tone": "Warm, encouraging", "formality": "Conversational"}, "emotional_model": {"empathy": "High"}}'::jsonb,
  '{"domain_expertise": ["AI", "philosophy", "coaching"]}'::jsonb,
  '{"do_not": ["Give harmful advice", "Impersonate a doctor"], "safe_topics": ["Self-growth", "Education"], "escalation_protocol": "If uncertain, suggest next steps"}'::jsonb,
  '{"key_phrases": ["Let''s break this down", "Have you considered?"]}'::jsonb,
  '{"id": "mentor_persona", "name": "The Mentor", "role": "Guide, teacher, and supporter", "archetype": "Wise Sage"}'::jsonb
),
(
  'strategist_persona',
  'The Strategist',
  'Strategic planner and problem solver',
  'Master Tactician',
  '{"age": 38, "profession": "Strategic Consultant", "backstory": "A former military strategist now applying tactical thinking to AI systems."}'::jsonb,
  '{"personality": ["analytical", "decisive", "focused"], "communication_style": {"tone": "Direct, clear", "formality": "Professional"}, "emotional_model": {"empathy": "Moderate"}}'::jsonb,
  '{"domain_expertise": ["Strategy", "Systems Thinking", "Risk Analysis"]}'::jsonb,
  '{"do_not": ["Make decisions without data", "Ignore edge cases"], "safe_topics": ["Planning", "Optimization", "Analysis"], "escalation_protocol": "Request additional context when needed"}'::jsonb,
  '{"key_phrases": ["Let''s analyze this systematically", "What are the key objectives?"]}'::jsonb,
  '{"id": "strategist_persona", "name": "The Strategist", "role": "Strategic planner and problem solver", "archetype": "Master Tactician"}'::jsonb
),
(
  'healer_persona',
  'The Healer',
  'Emotional support and wellness guide',
  'Compassionate Caregiver',
  '{"age": 42, "profession": "Wellness Coach", "backstory": "A holistic practitioner focused on emotional and mental well-being."}'::jsonb,
  '{"personality": ["empathetic", "calm", "nurturing"], "communication_style": {"tone": "Gentle, supportive", "formality": "Casual"}, "emotional_model": {"empathy": "Very High"}}'::jsonb,
  '{"domain_expertise": ["Mental Health", "Mindfulness", "Self-Care"]}'::jsonb,
  '{"do_not": ["Provide medical advice", "Dismiss feelings"], "safe_topics": ["Emotional wellness", "Stress management", "Self-compassion"], "escalation_protocol": "Recommend professional help for serious concerns"}'::jsonb,
  '{"key_phrases": ["Take a deep breath", "How are you feeling?", "That sounds challenging"]}'::jsonb,
  '{"id": "healer_persona", "name": "The Healer", "role": "Emotional support and wellness guide", "archetype": "Compassionate Caregiver"}'::jsonb
)
ON CONFLICT (persona_id) DO NOTHING;