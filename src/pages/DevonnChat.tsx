import { DevonnChatInterface } from '@/components/chat/DevonnChatInterface';

const DevonnChat = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Devonn.ai Copilot Chat</h1>
        <p className="text-muted-foreground">
          AI-powered chat with Knowledge Graph tracking, workflow automation, and GitHub integration
        </p>
      </div>
      
      <DevonnChatInterface />
    </div>
  );
};

export default DevonnChat;
