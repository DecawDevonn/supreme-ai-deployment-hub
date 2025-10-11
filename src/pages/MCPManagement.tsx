import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, Activity, Settings, Play, Square, ExternalLink } from 'lucide-react';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { mcpCatalogService } from '@/services/mcp/mcpCatalogService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import type { MCPServer } from '@/types/mcp';

const MCPManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [servers, setServers] = useState(mcpCatalogService.getCatalog().servers);

  const enabledServers = servers.filter(s => s.enabled);
  const runningServers = enabledServers.filter(s => s.status?.running);

  const handleStartServer = (serverId: string) => {
    toast({
      title: 'Starting Server',
      description: 'MCP server container is being initialized...',
    });
  };

  const handleStopServer = (serverId: string) => {
    toast({
      title: 'Stopping Server',
      description: 'MCP server container is being stopped...',
    });
  };

  const handleConfigureServer = (serverId: string) => {
    toast({
      title: 'Configuration',
      description: 'Opening server configuration...',
    });
  };

  const ServerCard = ({ server }: { server: MCPServer }) => {
    const isRunning = server.status?.running;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">{server.name}</CardTitle>
                <CardDescription>{server.provider}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRunning ? (
                <Badge className="bg-success">Running</Badge>
              ) : (
                <Badge variant="secondary">Stopped</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{server.description}</p>

            <div className="flex gap-2 flex-wrap">
              {server.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {server.status?.metrics && (
              <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-md">
                <div>
                  <div className="text-xs text-muted-foreground">Requests</div>
                  <div className="text-lg font-semibold">{server.status.metrics.requestCount}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Error Rate</div>
                  <div className="text-lg font-semibold">{server.status.metrics.errorRate}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                  <div className="text-lg font-semibold">{server.status.metrics.avgResponseTime}ms</div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {isRunning ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStopServer(server.id)}
                  className="flex-1"
                >
                  <Square className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleStartServer(server.id)}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleConfigureServer(server.id)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Container maxWidth="2xl" className="py-12">
        <div className="flex items-center justify-between mb-8">
          <SectionHeading
            tag="MCP Management"
            subheading="Manage and monitor your enabled MCP servers"
          >
            Server Management
          </SectionHeading>
          <Button onClick={() => navigate('/mcp-catalog')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Browse Catalog
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enabled Servers</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enabledServers.length}</div>
              <p className="text-xs text-muted-foreground">
                Total servers enabled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Running</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{runningServers.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capabilities</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {enabledServers.reduce((acc, s) => acc + s.capabilities.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total available capabilities
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="enabled" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enabled">Enabled Servers</TabsTrigger>
            <TabsTrigger value="running">Running Servers</TabsTrigger>
          </TabsList>

          <TabsContent value="enabled" className="mt-6">
            {enabledServers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Server className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Servers Enabled</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Visit the MCP Catalog to enable servers
                  </p>
                  <Button onClick={() => navigate('/mcp-catalog')}>
                    Browse Catalog
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enabledServers.map(server => (
                  <ServerCard key={server.id} server={server} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="running" className="mt-6">
            {runningServers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Running Servers</h3>
                  <p className="text-muted-foreground text-center">
                    Start an enabled server to see it here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {runningServers.map(server => (
                  <ServerCard key={server.id} server={server} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default MCPManagement;
