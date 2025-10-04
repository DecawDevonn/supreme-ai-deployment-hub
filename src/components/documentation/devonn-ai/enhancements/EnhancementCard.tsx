
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { FeatureService } from '@/services/features/featureService';
import { Loader2 } from 'lucide-react';

export interface Enhancement {
  id: string;
  featureName: string;
  title: string;
  description: string;
  icon: React.ElementType;
  tag: string;
  status: "Recommended" | "Optional";
}

interface EnhancementCardProps {
  enhancement: Enhancement;
}

const EnhancementCard: React.FC<EnhancementCardProps> = ({ enhancement }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadFeatureStatus = async () => {
      try {
        const status = await FeatureService.getFeatureStatus(enhancement.featureName);
        setIsEnabled(status);
      } catch (error) {
        console.error('Error loading feature status:', error);
      }
    };
    loadFeatureStatus();
  }, [enhancement.featureName]);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      await FeatureService.toggleFeature(enhancement.featureName, checked);
      setIsEnabled(checked);
      toast({
        title: checked ? 'Module Enabled' : 'Module Disabled',
        description: `${enhancement.title} has been ${checked ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      console.error('Error toggling feature:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle module. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border/50 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="p-2 rounded-md bg-primary/10 mb-2">
            {React.createElement(enhancement.icon, { size: 24, className: "text-primary" })}
          </div>
          <Badge variant={enhancement.status === "Recommended" ? "default" : "outline"}>
            {enhancement.status}
          </Badge>
        </div>
        <CardTitle className="text-base">{enhancement.title}</CardTitle>
        <Badge variant="outline" className="w-fit mt-1">{enhancement.tag}</Badge>
      </CardHeader>
      <CardContent>
        <CardDescription>{enhancement.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggle}
              disabled={isLoading}
            />
          )}
          <span className="text-sm text-muted-foreground">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <Button variant="ghost" size="sm">Learn More</Button>
      </CardFooter>
    </Card>
  );
};

export default EnhancementCard;
