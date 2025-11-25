import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Target, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const agents = [
  { id: 'content-creator', name: 'Content Creator AI', category: 'Content', icon: '✍️', description: 'Blog posts, articles, social media' },
  { id: 'market-researcher', name: 'Market Research AI', category: 'Research', icon: '📊', description: 'Trend analysis, niche finder' },
  { id: 'freelance-finder', name: 'Freelance Scout AI', category: 'Freelancing', icon: '💼', description: 'Gig finder, proposal writer' },
  { id: 'affiliate-optimizer', name: 'Affiliate Optimizer AI', category: 'Marketing', icon: '🔗', description: 'Affiliate marketing strategies' },
  { id: 'ecommerce-helper', name: 'E-commerce AI', category: 'E-commerce', icon: '🛒', description: 'Product research, store optimization' },
  { id: 'investment-advisor', name: 'Investment Research AI', category: 'Investing', icon: '📈', description: 'Market analysis, trend spotting' },
];

const MoneyHub = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [totalEarnings, setTotalEarnings] = useState(0);

  const runAgent = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const { data, error } = await supabase.functions.invoke('money-agent', {
        body: {
          agentType: selectedAgent.id,
          task: `Provide 3 specific actionable opportunities in the ${selectedAgent.category} category that can start generating income within 30 days.`
        }
      });

      if (error) throw error;

      setResult(data.response);
      setTotalEarnings(prev => prev + (data.estimatedEarnings || 0));
      toast.success(`${selectedAgent.name} completed! Potential: $${data.estimatedEarnings}`);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Agent failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black py-24 px-4">
      <div className="max-w-7xl mx-auto">
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
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
              💰 MoneyHub
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              100+ AI Agents Working to Generate Income
            </p>
            
            {/* Earnings Dashboard */}
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 p-6 mb-8">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Potential Earnings</p>
                  <p className="text-4xl font-bold text-green-400">${totalEarnings.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Active Agents</p>
                  <p className="text-4xl font-bold text-primary">{agents.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                  <p className="text-4xl font-bold text-blue-400">87%</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="results">Results & Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="agents">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Agent Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Select Agent</h3>
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <Card
                      key={agent.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedAgent.id === agent.id
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{agent.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold">{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">{agent.description}</p>
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary/20 rounded">
                            {agent.category}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Agent Action */}
              <div>
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
                  <h3 className="text-2xl font-bold mb-4">{selectedAgent.name}</h3>
                  <p className="text-muted-foreground mb-6">{selectedAgent.description}</p>
                  
                  <Button
                    onClick={runAgent}
                    disabled={loading}
                    className="w-full mb-6"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-pulse" />
                        Agent Running...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Run Agent
                      </>
                    )}
                  </Button>

                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border border-primary/20"
                    >
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        Agent Results
                      </h4>
                      <div className="prose prose-invert max-w-none text-sm">
                        {result.split('\n').map((line, i) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6">Earnings & Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-semibold">Session Earnings</p>
                    <p className="text-sm text-muted-foreground">Current session</p>
                  </div>
                  <p className="text-2xl font-bold text-green-400">${totalEarnings}</p>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-semibold">Agents Run</p>
                    <p className="text-sm text-muted-foreground">This session</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{result ? '1' : '0'}</p>
                </div>

                {result && (
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-400 mb-2">✓ Latest Agent Completed</p>
                    <p className="font-semibold">{selectedAgent.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MoneyHub;
