import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Play, GitBranch, Settings, Zap } from 'lucide-react';
import { toast } from 'sonner';

const Workflows = () => {
  const [workflows, setWorkflows] = useState([
    { id: '1', name: 'Data Processing Pipeline', status: 'active', lastRun: '2 hours ago' },
    { id: '2', name: 'Email Marketing Automation', status: 'paused', lastRun: '1 day ago' },
    { id: '3', name: 'Content Publishing Flow', status: 'active', lastRun: '30 minutes ago' },
  ]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Workflows
          </h1>
          <p className="text-muted-foreground">
            Automate tasks with visual workflow builder
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Workflows</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <GitBranch className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{workflow.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workflow.status === 'active' ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="text-amber-600">Paused</span>
                      )} • Last run: {workflow.lastRun}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Run
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active">
          <Card className="p-12 text-center">
            <Zap className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Active workflows will appear here</p>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Email Automation',
              'Data Sync',
              'Social Media Post',
              'Report Generation',
              'File Processing',
              'Webhook Handler'
            ].map((template) => (
              <Card key={template} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold mb-2">{template}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pre-built template ready to use
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <GitBranch className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="font-semibold mb-2">Visual Workflow Builder</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create complex automation workflows with a drag-and-drop interface. 
              Connect triggers, actions, and conditions to automate your tasks.
            </p>
            <Button variant="outline">
              Open Builder
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Workflows;
