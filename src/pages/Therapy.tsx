import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Brain, Shield, Heart, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const levels = [
  { id: 1, name: 'Surface', icon: Heart, color: 'cyan', description: 'Daily stress & emotions' },
  { id: 2, name: 'Subconscious', icon: Brain, color: 'purple', description: 'Patterns & beliefs' },
  { id: 3, name: 'Archetypal', icon: Sparkles, color: 'pink', description: 'Deep symbols & myths' },
  { id: 4, name: 'Transcendent', icon: Shield, color: 'yellow', description: 'Universal consciousness' }
];

export default function Therapy() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: string; content: string}>>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    try {
      const { data, error } = await supabase.functions.invoke('therapy-session', {
        body: { message: input, level: currentLevel }
      });
      
      if (error) throw error;
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      setInput('');
    } catch (error) {
      toast.error('Session error. Your safety is our priority.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
            AI Therapy
          </h1>
          <p className="text-gray-400 mt-2">4-Level Avatar Therapy with Safety Monitoring</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {levels.map((level) => {
            const Icon = level.icon;
            return (
              <Card
                key={level.id}
                className={`cursor-pointer transition-all ${
                  currentLevel === level.id
                    ? `bg-${level.color}-500/20 border-${level.color}-400`
                    : 'bg-black/50 border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => setCurrentLevel(level.id)}
              >
                <CardHeader>
                  <CardTitle className={`text-${level.color}-400 flex items-center gap-2`}>
                    <Icon className="w-5 h-5" />
                    Level {level.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white font-semibold">{level.name}</p>
                  <p className="text-gray-400 text-sm mt-1">{level.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-black/50 border-cyan-500/30">
          <CardContent className="p-6 space-y-4">
            <div className="h-96 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                  <p>Safe space. Share what's on your mind.</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`p-4 rounded-lg ${msg.role === 'user' ? 'bg-purple-900/30 ml-8' : 'bg-cyan-900/30 mr-8'}`}>
                    <p className="text-white">{msg.content}</p>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Share at Level ${currentLevel}: ${levels[currentLevel - 1].name}...`}
                className="bg-black/50 border-purple-500/30 text-white"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              />
              <Button
                onClick={sendMessage}
                disabled={loading}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
              >
                Send
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Safety monitoring active • Crisis support available 24/7</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
