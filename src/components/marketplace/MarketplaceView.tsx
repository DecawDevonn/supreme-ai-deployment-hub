import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import marketplaceDiagram from '@/assets/devonn-marketplace-diagram.png';
import { Package, Workflow, Bot, Server, ArrowRight, TrendingUp, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';

const MarketplaceView = () => {
  const categories = [
    {
      name: 'AI Agents',
      icon: Bot,
      description: 'Intelligent agents for automation',
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-500',
      count: '120+ Tools'
    },
    {
      name: 'Workflow Automation',
      icon: Workflow,
      description: 'Automated workflow orchestration',
      color: 'from-orange-500/20 to-orange-600/20',
      iconColor: 'text-orange-500',
      count: '85+ Tools'
    },
    {
      name: 'Productivity',
      icon: Package,
      description: 'Tools to enhance productivity',
      color: 'from-green-500/20 to-green-600/20',
      iconColor: 'text-green-500',
      count: '200+ Tools'
    },
    {
      name: 'MCP Servers',
      icon: Server,
      description: 'Model Context Protocol servers',
      color: 'from-cyan-500/20 to-cyan-600/20',
      iconColor: 'text-cyan-500',
      count: '45+ Tools'
    }
  ];

  const stats = [
    { label: 'Active Tools', value: '450+', icon: Sparkles },
    { label: 'Monthly Users', value: '10K+', icon: Users },
    { label: 'Success Rate', value: '99.9%', icon: TrendingUp }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-primary/20"
      >
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="relative p-8 md:p-12">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              v1.0 - Now Live
            </Badge>
            <SectionHeading 
              className="mb-4"
              subheading="Discover powerful AI tools and workflow automation plugins to supercharge your productivity"
            >
              Devonn Tools Marketplace
            </SectionHeading>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button size="lg" className="group">
                Explore Tools
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Submit Your Tool
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Categories Grid */}
      <div>
        <SectionHeading className="mb-6" tag="Categories">
          Browse by Category
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${category.iconColor}`} />
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{category.name}</CardTitle>
                        <CardDescription className="text-sm">{category.description}</CardDescription>
                      </div>
                    </div>
                    <div className="pt-4 border-t mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">{category.count}</span>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Architecture Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <SectionHeading 
              subheading="Visual overview of the Devonn Tools ecosystem"
            >
              Platform Architecture
            </SectionHeading>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-card/50 overflow-hidden backdrop-blur-sm">
              <img 
                src={marketplaceDiagram} 
                alt="Devonn Tools Marketplace Architecture"
                className="w-full h-auto"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Why Choose Devonn Marketplace?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">AI-Powered Agents</div>
                    <p className="text-sm text-muted-foreground">Orchestrate intelligent automation workflows with advanced AI capabilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Workflow className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Workflow Automation</div>
                    <p className="text-sm text-muted-foreground">Connect and automate business processes seamlessly</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Server className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">MCP Servers</div>
                    <p className="text-sm text-muted-foreground">Multi-agent operations and orchestration at scale</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Rich Integrations</div>
                    <p className="text-sm text-muted-foreground">CRM, notifications, security, analytics, and more</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Plugin Root:</strong> ./plugins - All marketplace tools are automatically available in your plugins directory
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MarketplaceView;
