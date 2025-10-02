import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id?: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: any;
  createdAt?: Date;
}

export interface KGEntity {
  type: string;
  name: string;
  properties?: Record<string, any>;
}

export interface KGRelationship {
  from: string;
  to: string;
  type: string;
}

export interface ChatResponse {
  response: string;
  entities: KGEntity[];
  relationships: KGRelationship[];
  workflows: any[];
  metadata: any;
}

export class DevonnChatService {
  private static instance: DevonnChatService;

  static getInstance(): DevonnChatService {
    if (!this.instance) {
      this.instance = new DevonnChatService();
    }
    return this.instance;
  }

  async sendMessage(
    conversationId: string,
    messages: Array<{ role: string; content: string }>
  ): Promise<ChatResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('devonn-chat', {
        body: {
          conversationId,
          messages,
          action: 'chat'
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to send message');

      return {
        response: data.response,
        entities: data.entities || [],
        relationships: data.relationships || [],
        workflows: data.workflows || [],
        metadata: data.metadata || {}
      };
    } catch (error: any) {
      console.error('Chat error:', error);
      throw new Error(error.message || 'Failed to send message');
    }
  }

  async createConversation(title?: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([
          {
            title: title || `Conversation ${new Date().toLocaleString()}`,
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error: any) {
      console.error('Create conversation error:', error);
      throw new Error(error.message || 'Failed to create conversation');
    }
  }

  async getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(msg => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
        metadata: msg.metadata,
        createdAt: new Date(msg.created_at)
      }));
    } catch (error: any) {
      console.error('Get conversation history error:', error);
      throw new Error(error.message || 'Failed to get conversation history');
    }
  }

  async getKnowledgeGraph(conversationId: string): Promise<{
    entities: KGEntity[];
    relationships: KGRelationship[];
  }> {
    try {
      const [entitiesResult, relationshipsResult] = await Promise.all([
        supabase
          .from('knowledge_graph_entities')
          .select('*')
          .eq('conversation_id', conversationId),
        supabase
          .from('knowledge_graph_relationships')
          .select('*')
          .eq('conversation_id', conversationId)
      ]);

      if (entitiesResult.error) throw entitiesResult.error;
      if (relationshipsResult.error) throw relationshipsResult.error;

      const entities = (entitiesResult.data || []).map(e => ({
        type: e.entity_type,
        name: e.entity_name,
        properties: (e.properties as Record<string, any>) || {}
      }));

      const relationships = (relationshipsResult.data || []).map(r => ({
        from: r.from_entity,
        to: r.to_entity,
        type: r.relationship_type
      }));

      return { entities, relationships };
    } catch (error: any) {
      console.error('Get knowledge graph error:', error);
      throw new Error(error.message || 'Failed to get knowledge graph');
    }
  }

  async listConversations(): Promise<Array<{ id: string; title: string; createdAt: Date }>> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data || []).map(conv => ({
        id: conv.id,
        title: conv.title || 'Untitled Conversation',
        createdAt: new Date(conv.created_at)
      }));
    } catch (error: any) {
      console.error('List conversations error:', error);
      throw new Error(error.message || 'Failed to list conversations');
    }
  }
}

export const chatService = DevonnChatService.getInstance();
