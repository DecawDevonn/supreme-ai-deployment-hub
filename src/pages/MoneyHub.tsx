import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, Play, Pause } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  category: string;
  description: string;
  status: string;
  total_earned: number;
  runs_count: number;
}

interface Earning {
  id: string;
  amount: number;
  source: string;
  description: string;
  earned_at: string;
}

export default function MoneyHub() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Subscribe to real-time earnings
    const channel = supabase
      .channel('agent_earnings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_earnings'
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [agentsRes, earningsRes] = await Promise.all([
        supabase.from('money_agents').select('*').eq('user_id', user.id),
        supabase.from('agent_earnings').select('*').eq('user_id', user.id).order('earned_at', { ascending: false }).limit(10)
      ]);

      if (agentsRes.data) setAgents(agentsRes.data);
      if (earningsRes.data) {
        setEarnings(earningsRes.data);
        const total = earningsRes.data.reduce((sum, e) => sum + Number(e.amount), 0);
        setTotalEarnings(total);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (category: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const agentName = `${category} Agent ${agents.filter(a => a.category === category).length + 1}`;
      
      const { error } = await supabase.from('money_agents').insert({
        user_id: user.id,
        name: agentName,
        category,
        description: `Automated ${category} money-making agent`,
        status: 'idle'
      });

      if (error) throw error;
      toast.success('Agent created!');
      loadData();
    } catch (error) {
      toast.error('Failed to create agent');
    }
  };

  const toggleAgent = async (agent: Agent) => {
    try {
      const newStatus = agent.status === 'active' ? 'idle' : 'active';
      const { error } = await supabase
        .from('money_agents')
        .update({ status: newStatus })
        .eq('id', agent.id);

      if (error) throw error;
      toast.success(`Agent ${newStatus}`);
      loadData();
    } catch (error) {
      toast.error('Failed to toggle agent');
    }
  };

  const categories = [
    'Affiliate Marketing', 'Content Creation', 'Dropshipping', 'Freelancing',
    'Stock Trading', 'Crypto Mining', 'Course Creation', 'Print on Demand',
    'SEO Services', 'Social Media', 'Email Marketing', 'Web Development'
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              MoneyHub
            </h1>
            <p className="text-gray-400 mt-2">100+ White-Hat Money-Making Agents</p>
          </div>
          <Card className="bg-black/50 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <DollarSign className="w-5 h-5" />
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">${totalEarnings.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category} className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <CardTitle className="text-cyan-400">{category}</CardTitle>
                <CardDescription className="text-gray-400">
                  {agents.filter(a => a.category === category).length} agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => createAgent(category)} className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
                  Create Agent
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-black/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Active Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agents.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No agents yet. Create your first agent above!</p>
            ) : (
              agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 bg-purple-950/30 rounded-lg border border-purple-500/20">
                  <div>
                    <h3 className="text-white font-semibold">{agent.name}</h3>
                    <p className="text-gray-400 text-sm">{agent.category}</p>
                    <p className="text-green-400 text-sm mt-1">Earned: ${Number(agent.total_earned).toFixed(2)}</p>
                  </div>
                  <Button
                    onClick={() => toggleAgent(agent)}
                    variant={agent.status === 'active' ? 'destructive' : 'default'}
                    size="sm"
                    className={agent.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {agent.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">Recent Earnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {earnings.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No earnings yet</p>
            ) : (
              earnings.map((earning) => (
                <div key={earning.id} className="flex justify-between items-center p-3 bg-purple-950/20 rounded border border-purple-500/10">
                  <div>
                    <p className="text-white font-medium">{earning.source}</p>
                    <p className="text-gray-400 text-sm">{earning.description}</p>
                  </div>
                  <p className="text-green-400 font-bold">+${Number(earning.amount).toFixed(2)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
