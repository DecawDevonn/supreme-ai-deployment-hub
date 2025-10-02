-- Create chat_messages table for conversation history
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create knowledge_graph_entities table
CREATE TABLE IF NOT EXISTS public.knowledge_graph_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create knowledge_graph_relationships table
CREATE TABLE IF NOT EXISTS public.knowledge_graph_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  from_entity TEXT NOT NULL,
  to_entity TEXT NOT NULL,
  relationship_type TEXT NOT NULL,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON public.chat_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_kg_entities_conversation ON public.knowledge_graph_entities(conversation_id);
CREATE INDEX IF NOT EXISTS idx_kg_relationships_conversation ON public.knowledge_graph_relationships(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created ON public.conversations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_graph_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_graph_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth needs)
CREATE POLICY "Allow public read access to chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert to chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to kg_entities" ON public.knowledge_graph_entities FOR SELECT USING (true);
CREATE POLICY "Allow public insert to kg_entities" ON public.knowledge_graph_entities FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to kg_relationships" ON public.knowledge_graph_relationships FOR SELECT USING (true);
CREATE POLICY "Allow public insert to kg_relationships" ON public.knowledge_graph_relationships FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert to conversations" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to conversations" ON public.conversations FOR UPDATE USING (true);

-- Function to update conversation timestamp
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating conversation timestamp
CREATE TRIGGER update_conversations_timestamp
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_timestamp();
