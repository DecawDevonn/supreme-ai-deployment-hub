import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Star, Play, Settings } from 'lucide-react';
import type { MCPServer } from '@/types/mcp';

interface MCPServerCardProps {
  server: MCPServer;
  onEnable?: (serverId: string) => void;
  onConfigure?: (serverId: string) => void;
}

const MCPServerCard: React.FC<MCPServerCardProps> = ({ server, onEnable, onConfigure }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{server.name}</CardTitle>
            <CardDescription className="text-sm mt-1">{server.provider}</CardDescription>
          </div>
          <Badge variant="secondary">{server.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{server.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {server.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{(server.downloads / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{server.stars}</span>
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          <p>{server.capabilities.length} capabilities available</p>
          <p>Version: {server.version}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          size="sm" 
          onClick={() => onEnable?.(server.id)}
          className="flex-1"
        >
          <Play className="h-4 w-4 mr-1" />
          Enable
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onConfigure?.(server.id)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MCPServerCard;
