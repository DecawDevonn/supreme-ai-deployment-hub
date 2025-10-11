import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import marketplaceDiagram from '@/assets/devonn-marketplace-diagram.png';
import { Package, Workflow, Bot, Server } from 'lucide-react';

const MarketplaceView = () => {
  const categories = [
    {
      name: 'AI Agents',
      icon: Bot,
      description: 'Intelligent agents for automation',
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      name: 'Workflow Automation',
      icon: Workflow,
      description: 'Automated workflow orchestration',
      color: 'bg-orange-500/10 text-orange-500'
    },
    {
      name: 'Productivity',
      icon: Package,
      description: 'Tools to enhance productivity',
      color: 'bg-green-500/10 text-green-500'
    },
    {
      name: 'MCP Servers',
      icon: Server,
      description: 'Model Context Protocol servers',
      color: 'bg-cyan-500/10 text-cyan-500'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Devonn Tools Marketplace</CardTitle>
              <CardDescription>
                Official Devonn.ai plugin marketplace - Version 1.0
              </CardDescription>
            </div>
            <Badge variant="secondary">v1.0</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-card overflow-hidden">
            <img 
              src={marketplaceDiagram} 
              alt="Devonn Tools Marketplace Architecture"
              className="w-full h-auto"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.name}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marketplace Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Plugin Root:</strong> ./plugins</li>
            <li>• <strong>AI Agents:</strong> Orchestrate intelligent automation workflows</li>
            <li>• <strong>Workflow Automation:</strong> Connect and automate business processes</li>
            <li>• <strong>MCP Servers:</strong> Multi-agent operations and orchestration</li>
            <li>• <strong>Integrations:</strong> CRM, notifications, security, and analytics</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceView;
