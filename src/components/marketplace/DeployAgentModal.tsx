import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Rocket, 
  Server, 
  Zap, 
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AgentTemplate, AgentDeploymentConfig } from '@/types/marketplace';
import { getPricingLabel } from '@/data/mockAgentTemplates';
import { toast } from '@/hooks/use-toast';

interface DeployAgentModalProps {
  agent: AgentTemplate | null;
  open: boolean;
  onClose: () => void;
  onDeployComplete: (agent: AgentTemplate, config: AgentDeploymentConfig) => void;
}

const DeployAgentModal: React.FC<DeployAgentModalProps> = ({
  agent,
  open,
  onClose,
  onDeployComplete
}) => {
  const [step, setStep] = useState<'config' | 'review' | 'deploying' | 'complete'>('config');
  const [config, setConfig] = useState<AgentDeploymentConfig>({
    name: '',
    environment: 'development',
    notifications: {}
  });
  const [deploying, setDeploying] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);

  React.useEffect(() => {
    if (agent) {
      setConfig(prev => ({
        ...prev,
        name: agent.name.toLowerCase().replace(/\s+/g, '-') + '-1'
      }));
    }
    setStep('config');
    setDeploying(false);
  }, [agent]);

  if (!agent) return null;

  const handleDeploy = async () => {
    setDeploying(true);
    setStep('deploying');

    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 2000));

    setStep('complete');
    setDeploying(false);
    
    toast({
      title: 'Agent Deployed Successfully!',
      description: `${agent.name} is now active in your ${config.environment} environment.`,
    });

    onDeployComplete(agent, config);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Deploy {agent.name}
          </DialogTitle>
          <DialogDescription>
            Configure and deploy this agent to your infrastructure
          </DialogDescription>
        </DialogHeader>

        {step === 'config' && (
          <div className="space-y-6 py-4">
            {/* Instance Name */}
            <div className="space-y-2">
              <Label htmlFor="instance-name">Instance Name</Label>
              <Input
                id="instance-name"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="my-agent-instance"
              />
            </div>

            {/* Environment */}
            <div className="space-y-3">
              <Label>Environment</Label>
              <RadioGroup
                value={config.environment}
                onValueChange={(value: any) => setConfig({ ...config, environment: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="development" id="dev" />
                  <Label htmlFor="dev" className="font-normal cursor-pointer">
                    Development
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staging" id="staging" />
                  <Label htmlFor="staging" className="font-normal cursor-pointer">
                    Staging
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="production" id="prod" />
                  <Label htmlFor="prod" className="font-normal cursor-pointer">
                    Production
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Notifications */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Enable Notifications
                </Label>
                <Switch
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
              </div>
              {enableNotifications && (
                <div className="space-y-2 pl-6">
                  <Input
                    placeholder="Email (optional)"
                    value={config.notifications?.email?.[0] || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: {
                        ...config.notifications,
                        email: e.target.value ? [e.target.value] : undefined
                      }
                    })}
                  />
                  <Input
                    placeholder="Slack webhook URL (optional)"
                    value={config.notifications?.slack || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: {
                        ...config.notifications,
                        slack: e.target.value || undefined
                      }
                    })}
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Pricing Summary */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <div className="font-medium">{agent.name}</div>
                <div className="text-sm text-muted-foreground">
                  {agent.pricing.model === 'free' ? 'Free forever' : 
                   agent.pricing.model === 'subscription' ? 'Billed monthly' :
                   agent.pricing.model === 'one-time' ? 'One-time payment' :
                   'Pay per use'}
                </div>
              </div>
              <div className="text-xl font-bold text-primary">
                {getPricingLabel(agent.pricing)}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep('review')} disabled={!config.name}>
                Review & Deploy
              </Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Agent</span>
                <span className="font-medium">{agent.name}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Instance Name</span>
                <span className="font-medium">{config.name}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Environment</span>
                <Badge variant="outline" className="capitalize">{config.environment}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Notifications</span>
                <span className="font-medium">
                  {enableNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-sm font-medium">Total Cost</span>
                <span className="text-lg font-bold text-primary">
                  {getPricingLabel(agent.pricing)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('config')}>
                Back
              </Button>
              <Button onClick={handleDeploy}>
                <Rocket className="w-4 h-4 mr-2" />
                Deploy Now
              </Button>
            </div>
          </div>
        )}

        {step === 'deploying' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="font-medium text-lg">Deploying Agent...</div>
              <div className="text-sm text-muted-foreground mt-1">
                Setting up {config.name} in {config.environment}
              </div>
            </div>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <div className="font-medium text-lg">Deployment Complete!</div>
              <div className="text-sm text-muted-foreground mt-1">
                {agent.name} is now running in your {config.environment} environment
              </div>
            </div>
            <div className="flex justify-center gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => {
                toast({
                  title: 'Opening Agent Dashboard',
                  description: 'Redirecting to your deployed agent...',
                });
                onClose();
              }}>
                <Server className="w-4 h-4 mr-2" />
                View Agent
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeployAgentModal;
