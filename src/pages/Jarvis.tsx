import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2 } from 'lucide-react';
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

      const aiResponse = data.response;

      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Optional: Text-to-speech
      if (isSpeaking && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
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
    <div className="flex flex-col h-screen bg-slate-900 text-cyan-400">
      <div className="flex flex-col h-full max-w-3xl w-full mx-auto p-4">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-cyan-400/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/10 rounded-full border border-cyan-400/30 animate-pulse">
              <div className="w-6 h-6 bg-cyan-400 rounded-full" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-widest">J.A.R.V.I.S</h1>
              <p className="text-xs text-slate-500">Just A Rather Very Intelligent System</p>
            </div>
          </div>
          <div className="text-sm text-green-500 font-mono">
            System Online
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-cyan-600/30 text-cyan-100 rounded-br-none' 
                  : 'bg-slate-700/50 text-cyan-200 rounded-tl-none border border-cyan-400/10'
              }`}>
                {msg.content}
                <div className="text-right text-xs mt-1 opacity-50">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="p-3 bg-slate-700/50 rounded-xl rounded-tl-none border border-cyan-400/10">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
              </div>
            </div>
          )}
        </main>

        {/* Input Area */}
        <footer className="p-4 border-t border-cyan-400/20 bg-slate-900">
          <div className="flex items-center space-x-3">
            {/* STT/Mic Toggle Button */}
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full transition-colors ${
                isListening ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-slate-700/50 hover:bg-slate-600'
              }`}
              disabled={loading}
            >
              {isListening ? (
                <Mic className="w-5 h-5 text-red-400 animate-pulse" />
              ) : (
                <MicOff className="w-5 h-5 text-cyan-400/50" />
              )}
            </button>

            {/* TTS/Speaker Toggle Button */}
            <button
              onClick={() => setIsSpeaking(!isSpeaking)}
              className={`p-3 rounded-full transition-colors ${
                isSpeaking ? 'bg-cyan-500/20 hover:bg-cyan-500/30' : 'bg-slate-700/50 hover:bg-slate-600'
              }`}
              disabled={loading}
            >
              {isSpeaking ? (
                <Volume2 className="w-5 h-5 text-cyan-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
            </button>

            {/* Input Field */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask JARVIS anything..."
              className="flex-1 bg-slate-900/50 border border-cyan-400/30 text-cyan-100 placeholder:text-cyan-400/30 p-3 rounded-lg resize-none h-12 overflow-hidden focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
              disabled={loading}
            />

            {/* Send Button */}
            <button
              onClick={sendMessage}
              className={`p-3 rounded-full transition-colors ${
                input.trim() ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
              disabled={!input.trim() || loading}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </footer>

        {/* System Info */}
        <div className="text-center text-xs text-slate-500 pt-2 pb-1">
          JARVIS v4.2.1 | Neural Network Active | Response Time: &lt;200ms
        </div>
      </div>
    </div>
  );
}
