-- Add user_id to conversations table
ALTER TABLE public.conversations ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);

-- Drop existing public policies
DROP POLICY IF EXISTS "Allow public insert to conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow public read access to conversations" ON public.conversations;
DROP POLICY IF EXISTS "Allow public update to conversations" ON public.conversations;

DROP POLICY IF EXISTS "Allow public insert to chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public read access to chat_messages" ON public.chat_messages;

DROP POLICY IF EXISTS "Allow public insert to kg_entities" ON public.knowledge_graph_entities;
DROP POLICY IF EXISTS "Allow public read access to kg_entities" ON public.knowledge_graph_entities;

DROP POLICY IF EXISTS "Allow public insert to kg_relationships" ON public.knowledge_graph_relationships;
DROP POLICY IF EXISTS "Allow public read access to kg_relationships" ON public.knowledge_graph_relationships;

-- Create user-specific RLS policies for conversations
CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user-specific RLS policies for chat_messages (via conversation ownership)
CREATE POLICY "Users can view messages in own conversations"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = chat_messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = chat_messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Create user-specific RLS policies for knowledge graph entities
CREATE POLICY "Users can view KG entities in own conversations"
  ON public.knowledge_graph_entities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = knowledge_graph_entities.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create KG entities in own conversations"
  ON public.knowledge_graph_entities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = knowledge_graph_entities.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Create user-specific RLS policies for knowledge graph relationships
CREATE POLICY "Users can view KG relationships in own conversations"
  ON public.knowledge_graph_relationships FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = knowledge_graph_relationships.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create KG relationships in own conversations"
  ON public.knowledge_graph_relationships FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = knowledge_graph_relationships.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );