import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Plus, MessageSquare } from 'lucide-react';
import { useDevonnChat } from '@/hooks/useDevonnChat';
import { KnowledgeGraphView } from './KnowledgeGraphView';
import { cn } from '@/lib/utils';

export const DevonnChatInterface = () => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    conversationId,
    messages,
    isLoading,
    entities,
    relationships,
    conversations,
    startNewConversation,
    loadConversation,
    sendMessage,
  } = useDevonnChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
      {/* Conversations Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => startNewConversation()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-2">
                {conversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No conversations yet
                  </p>
                ) : (
                  conversations.map((conv) => (
                    <Card
                      key={conv.id}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/50",
                        conversationId === conv.id && "border-primary bg-muted/30"
                      )}
                      onClick={() => loadConversation(conv.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm font-medium line-clamp-1">
                            {conv.title}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {conv.createdAt.toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Devonn.ai Copilot</CardTitle>
            <CardDescription>
              AI assistant with Knowledge Graph tracking and workflow automation
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <div className="space-y-4 pb-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Start a conversation</p>
                    <p className="text-sm">
                      Ask about deployments, workflows, or GitHub integration
                    </p>
                  </div>
                ) : (
                  messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex gap-3",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-4",
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={message.role === 'user' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {message.role}
                          </Badge>
                          {message.createdAt && (
                            <span className="text-xs opacity-70">
                              {message.createdAt.toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="pt-4 border-t mt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about deployments, CI/CD, GitHub issues..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Graph Sidebar */}
      <div className="lg:col-span-1">
        <KnowledgeGraphView entities={entities} relationships={relationships} />
      </div>
    </div>
  );
};
