import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Brain, Sparkles, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const therapyLevels = [
  { level: 1, name: 'Supportive Listener', icon: Heart, color: 'text-blue-400', description: 'Empathetic listening and emotional support' },
  { level: 2, name: 'Cognitive Guide', icon: Brain, color: 'text-purple-400', description: 'CBT techniques and thought reframing' },
  { level: 3, name: 'Depth Analyst', icon: Shield, color: 'text-orange-400', description: 'Deep pattern analysis and insights' },
  { level: 4, name: 'Transformational Guide', icon: Sparkles, color: 'text-pink-400', description: 'Transformational healing and wisdom' },
];

const Therapy = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('therapy-session', {
        body: {
          message: userMessage,
          level: selectedLevel,
          history: conversation
        }
      });

      if (error) throw error;

      setConversation(prev => [...prev, { role: 'assistant', content: data.response }]);
      
      if (data.safetyAlert) {
        setShowSafetyAlert(true);
        toast.error('Crisis support resources available - please see alert', { duration: 10000 });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Session failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400 bg-clip-text text-transparent">
              🧘 AI Therapy
            </h1>
            <p className="text-xl text-muted-foreground">
              4-Level Avatar Therapy with Safety Monitoring
            </p>
          </motion.div>
        </div>

        {/* Safety Alert */}
        {showSafetyAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 bg-red-500/10 border-2 border-red-500/50 rounded-lg"
          >
            <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Crisis Support Resources</h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">If you're in crisis, please contact:</p>
              <p>📞 988 - Suicide & Crisis Lifeline (24/7)</p>
              <p>💬 Crisis Text Line: Text HOME to 741741</p>
              <p>🚨 Emergency: 911</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSafetyAlert(false)}
              className="mt-4"
            >
              I understand
            </Button>
          </motion.div>
        )}

        {/* Level Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {therapyLevels.map((level) => {
            const Icon = level.icon;
            return (
              <Card
                key={level.level}
                onClick={() => setSelectedLevel(level.level)}
                className={`p-6 cursor-pointer transition-all ${
                  selectedLevel === level.level
                    ? 'bg-primary/10 border-primary shadow-lg'
                    : 'hover:bg-muted/50'
                }`}
              >
                <Icon className={`w-8 h-8 ${level.color} mb-3`} />
                <h3 className="font-semibold mb-2">Level {level.level}</h3>
                <p className="text-sm text-muted-foreground">{level.name}</p>
              </Card>
            );
          })}
        </div>

        {/* Chat Interface */}
        <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
          {/* Chat Messages */}
          <div className="h-[400px] overflow-y-auto p-6 space-y-4">
            {conversation.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <p className="text-muted-foreground mb-2">
                    Welcome to AI Therapy Session
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Share what's on your mind. This is a safe, confidential space.
                  </p>
                </div>
              </div>
            ) : (
              conversation.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Therapist is responding...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                size="lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Level {selectedLevel}: {therapyLevels[selectedLevel - 1].name}
            </p>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="mt-6 p-4 bg-yellow-500/5 border-yellow-500/20">
          <p className="text-xs text-muted-foreground">
            ⚠️ This AI therapy tool is for informational purposes only and not a substitute for professional mental health care. 
            If you're experiencing a mental health crisis, please contact a licensed professional or crisis hotline immediately.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Therapy;
