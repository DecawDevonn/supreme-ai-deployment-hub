import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Send, Bot, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Jarvis() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Good evening. JARVIS system online. How may I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('jarvis-chat', {
        body: { message: input, history: messages },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Optional: Text-to-speech
      if (isSpeaking && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 1.1;
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('JARVIS error:', error);
      toast.error('JARVIS system error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice recognition error');
    };

    recognition.start();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-10 h-10 text-cyan-400" />
              <Zap className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 font-mono">J.A.R.V.I.S</h1>
              <p className="text-xs text-cyan-300/60">Just A Rather Very Intelligent System</p>
            </div>
          </div>
          <Badge variant="outline" className="border-cyan-400/30 text-cyan-400">
            System Online
          </Badge>
        </div>

        {/* Chat Area */}
        <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-sm mb-4 h-[500px] overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-cyan-600/20 border border-cyan-400/30 text-cyan-100'
                      : 'bg-blue-900/30 border border-blue-400/30 text-blue-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-blue-900/30 border border-blue-400/30 text-blue-100 p-3 rounded-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Input Area */}
        <Card className="bg-slate-900/50 border-cyan-400/20 backdrop-blur-sm p-4">
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className={`border-cyan-400/30 ${
                isListening ? 'bg-red-500/20 border-red-400' : 'hover:bg-cyan-400/10'
              }`}
              onClick={toggleListening}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-red-400" />
              ) : (
                <Mic className="w-4 h-4 text-cyan-400" />
              )}
            </Button>

            <Button
              size="icon"
              variant="outline"
              className={`border-cyan-400/30 ${
                isSpeaking ? 'bg-cyan-500/20' : 'hover:bg-cyan-400/10'
              }`}
              onClick={() => setIsSpeaking(!isSpeaking)}
            >
              {isSpeaking ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-cyan-400/50" />
              )}
            </Button>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask JARVIS anything..."
              className="flex-1 bg-slate-900/50 border-cyan-400/30 text-cyan-100 placeholder:text-cyan-400/30"
              disabled={loading}
            />

            <Button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* System Info */}
        <div className="mt-4 text-center text-cyan-400/40 text-xs font-mono">
          JARVIS v4.2.1 | Neural Network Active | Response Time: &lt;200ms
        </div>
      </div>
    </div>
  );
}
