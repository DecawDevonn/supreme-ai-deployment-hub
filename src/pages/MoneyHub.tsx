import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, DollarSign, TrendingUp, Sparkles, Play, Pause, 
  Settings, ExternalLink, Search, Filter, Download, RefreshCw,
  Laptop, ShoppingCart, TrendingDown, Wallet, Target, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'active' | 'paused' | 'idle';
  earned: number;
  potentialPerDay: number;
  icon: any;
}

interface Earnings {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  activeAgents: number;
  totalRuns: number;
}

const MoneyHub = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [earnings] = useState<Earnings>({
    total: 12847.50,
    today: 342.75,
    thisWeek: 1876.40,
    thisMonth: 8234.90,
    activeAgents: 47,
    totalRuns: 1842
  });

  const categories = [
    'All', 'Freelancing', 'E-Commerce', 'Content', 'Trading', 'Affiliate', 'Data', 'Other'
  ];

  const [agents] = useState<Agent[]>([
    // Freelancing Agents
    { id: '1', name: 'Upwork Proposal Bot', category: 'Freelancing', description: 'Auto-applies to matching projects with custom proposals', status: 'active', earned: 2340, potentialPerDay: 150, icon: Laptop },
    { id: '2', name: 'Fiverr Optimizer', category: 'Freelancing', description: 'Optimizes gig rankings and responds to inquiries', status: 'active', earned: 1890, potentialPerDay: 120, icon: Sparkles },
    { id: '3', name: 'LinkedIn Cold Reacher', category: 'Freelancing', description: 'Finds and messages potential clients on LinkedIn', status: 'active', earned: 1560, potentialPerDay: 95, icon: Target },
    
    // E-Commerce Agents
    { id: '4', name: 'Amazon FBA Scout', category: 'E-Commerce', description: 'Finds profitable products to resell on Amazon', status: 'active', earned: 3200, potentialPerDay: 200, icon: ShoppingCart },
    { id: '5', name: 'Etsy Listing Generator', category: 'E-Commerce', description: 'Creates and optimizes product listings automatically', status: 'paused', earned: 890, potentialPerDay: 75, icon: Sparkles },
    { id: '6', name: 'Shopify Dropship Finder', category: 'E-Commerce', description: 'Identifies trending dropshipping products', status: 'active', earned: 1670, potentialPerDay: 110, icon: TrendingUp },
    
    // Content Agents
    { id: '7', name: 'Blog SEO Writer', category: 'Content', description: 'Writes SEO-optimized blog posts for clients', status: 'active', earned: 2100, potentialPerDay: 140, icon: Laptop },
    { id: '8', name: 'YouTube Script Generator', category: 'Content', description: 'Creates engaging video scripts for creators', status: 'active', earned: 1450, potentialPerDay: 90, icon: Play },
    { id: '9', name: 'Social Media Scheduler', category: 'Content', description: 'Schedules and posts optimized social content', status: 'active', earned: 980, potentialPerDay: 65, icon: RefreshCw },
    
    // Trading Agents
    { id: '10', name: 'Crypto Arbitrage Scanner', category: 'Trading', description: 'Finds arbitrage opportunities across exchanges', status: 'active', earned: 4200, potentialPerDay: 280, icon: Wallet },
    { id: '11', name: 'Stock Momentum Tracker', category: 'Trading', description: 'Identifies momentum stocks for day trading', status: 'active', earned: 3100, potentialPerDay: 205, icon: TrendingUp },
    { id: '12', name: 'Options Flow Analyzer', category: 'Trading', description: 'Analyzes unusual options activity', status: 'paused', earned: 1890, potentialPerDay: 125, icon: TrendingDown },
    
    // Affiliate Agents
    { id: '13', name: 'Niche Site Builder', category: 'Affiliate', description: 'Builds and monetizes affiliate niche sites', status: 'active', earned: 2700, potentialPerDay: 180, icon: ExternalLink },
    { id: '14', name: 'Coupon Code Hunter', category: 'Affiliate', description: 'Finds and promotes trending coupon codes', status: 'active', earned: 1230, potentialPerDay: 80, icon: Target },
    { id: '15', name: 'Review Site Generator', category: 'Affiliate', description: 'Creates product review sites automatically', status: 'idle', earned: 560, potentialPerDay: 45, icon: Sparkles },
    
    // Data Agents
    { id: '16', name: 'Web Scraper Pro', category: 'Data', description: 'Collects and sells business leads', status: 'active', earned: 1890, potentialPerDay: 125, icon: Download },
    { id: '17', name: 'Email Validator', category: 'Data', description: 'Validates email lists for businesses', status: 'active', earned: 1340, potentialPerDay: 90, icon: Filter },
    { id: '18', name: 'Market Research Bot', category: 'Data', description: 'Gathers market intelligence for companies', status: 'active', earned: 2100, potentialPerDay: 140, icon: Search },
  ]);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAgent = (agentId: string) => {
    toast.success('Agent status toggled');
  };

  const configureAgent = (agentId: string) => {
    toast.info('Agent configuration opening...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-green-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                MoneyHub - White-Hat Income Agents
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Earnings Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-slate-400">Total Earned</h3>
                <Wallet className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                ${earnings.total.toLocaleString()}
              </p>
              <p className="text-sm text-green-400">+{earnings.thisMonth.toLocaleString()} this month</p>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-slate-400">Today's Earnings</h3>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                ${earnings.today.toLocaleString()}
              </p>
              <p className="text-sm text-blue-400">From {earnings.activeAgents} agents</p>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-slate-400">Active Runs</h3>
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {earnings.totalRuns}
              </p>
              <p className="text-sm text-purple-400">{earnings.activeAgents} agents working</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-slate-900/50 border-purple-500/20 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search agents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-purple-500/30 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category 
                      ? "bg-purple-500 hover:bg-purple-600" 
                      : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10"}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Agent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-slate-900/50 border-purple-500/20 p-6 hover:border-purple-500/40 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          agent.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          agent.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{agent.name}</h3>
                          <Badge variant="outline" className="mt-1 text-xs border-purple-500/30 text-purple-400">
                            {agent.category}
                          </Badge>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        agent.status === 'active' ? 'bg-green-400 animate-pulse' :
                        agent.status === 'paused' ? 'bg-yellow-400' :
                        'bg-slate-500'
                      }`} />
                    </div>

                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {agent.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Total Earned</span>
                        <span className="text-green-400 font-bold">${agent.earned}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Potential/Day</span>
                        <span className="text-blue-400 font-medium">${agent.potentialPerDay}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleAgent(agent.id)}
                        size="sm"
                        variant={agent.status === 'active' ? 'destructive' : 'default'}
                        className={agent.status === 'active' 
                          ? 'flex-1' 
                          : 'flex-1 bg-green-500 hover:bg-green-600'}
                      >
                        {agent.status === 'active' ? (
                          <>
                            <Pause className="w-3 h-3 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => configureAgent(agent.id)}
                        size="sm"
                        variant="outline"
                        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredAgents.length === 0 && (
            <Card className="bg-slate-900/50 border-purple-500/20 p-12 text-center">
              <p className="text-slate-400">No agents found matching your filters</p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MoneyHub;
