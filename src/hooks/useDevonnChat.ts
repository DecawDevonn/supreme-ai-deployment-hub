import { useState, useCallback, useEffect } from 'react';
import { chatService, ChatMessage, KGEntity, KGRelationship } from '@/services/chat/devonnChatService';
import { toast } from '@/hooks/use-toast';

export const useDevonnChat = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState<KGEntity[]>([]);
  const [relationships, setRelationships] = useState<KGRelationship[]>([]);
  const [conversations, setConversations] = useState<Array<{ id: string; title: string; createdAt: Date }>>([]);

  const loadConversations = useCallback(async () => {
    try {
      const convs = await chatService.listConversations();
      setConversations(convs);
    } catch (error: any) {
      console.error('Failed to load conversations:', error);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const startNewConversation = useCallback(async (title?: string) => {
    try {
      const newConvId = await chatService.createConversation(title);
      setConversationId(newConvId);
      setMessages([]);
      setEntities([]);
      setRelationships([]);
      await loadConversations();
      
      toast({
        title: "New Conversation",
        description: "Started a new conversation",
        variant: "default",
        duration: 2000,
      });
    } catch (error: any) {
      toast({
        title: "Failed to Start Conversation",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [loadConversations]);

  const loadConversation = useCallback(async (convId: string) => {
    setIsLoading(true);
    try {
      setConversationId(convId);
      const history = await chatService.getConversationHistory(convId);
      setMessages(history);
      
      const kg = await chatService.getKnowledgeGraph(convId);
      setEntities(kg.entities);
      setRelationships(kg.relationships);
    } catch (error: any) {
      toast({
        title: "Failed to Load Conversation",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) {
      await startNewConversation();
      return;
    }

    const userMessage: ChatMessage = {
      conversationId,
      role: 'user',
      content,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await chatService.sendMessage(conversationId, allMessages);

      const assistantMessage: ChatMessage = {
        conversationId,
        role: 'assistant',
        content: response.response,
        metadata: response.metadata,
        createdAt: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update knowledge graph
      if (response.entities.length > 0) {
        setEntities(prev => [...prev, ...response.entities]);
      }
      if (response.relationships.length > 0) {
        setRelationships(prev => [...prev, ...response.relationships]);
      }

    } catch (error: any) {
      toast({
        title: "Failed to Send Message",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });

      // Remove the user message on error
      setMessages(prev => prev.filter(m => m !== userMessage));
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, messages, startNewConversation]);

  return {
    conversationId,
    messages,
    isLoading,
    entities,
    relationships,
    conversations,
    startNewConversation,
    loadConversation,
    sendMessage,
    loadConversations,
  };
};
