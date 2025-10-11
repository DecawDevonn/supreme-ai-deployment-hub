import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Server, Zap, AlertCircle } from 'lucide-react';
import { mcpCatalogService } from '@/services/mcp/mcpCatalogService';
import type { MCPNodeConfig } from '@/types/nodes/mcpNode';
import type { MCPServer, MCPCapability } from '@/types/mcp';

interface MCPNodeProps {
  config?: MCPNodeConfig;
  onChange?: (config: MCPNodeConfig) => void;
}

const MCPNode: React.FC<MCPNodeProps> = ({ config, onChange }) => {
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null);
  const [selectedCapability, setSelectedCapability] = useState<MCPCapability | null>(null);
  const [parameters, setParameters] = useState<Record<string, any>>({});

  const catalog = mcpCatalogService.getCatalog();
  const enabledServers = catalog.servers.filter(s => s.enabled);

  useEffect(() => {
    if (config) {
      const server = mcpCatalogService.getServerById(config.serverId);
      setSelectedServer(server || null);
      setSelectedCapability(config.capability);
      setParameters(config.parameters);
    }
  }, [config]);

  const handleServerChange = (serverId: string) => {
    const server = mcpCatalogService.getServerById(serverId);
    setSelectedServer(server || null);
    setSelectedCapability(null);
    setParameters({});
  };

  const handleCapabilityChange = (capabilityName: string) => {
    const capability = selectedServer?.capabilities.find(c => c.name === capabilityName);
    setSelectedCapability(capability || null);
    setParameters({});
  };

  const handleParameterChange = (key: string, value: any) => {
    const newParams = { ...parameters, [key]: value };
    setParameters(newParams);

    if (selectedServer && selectedCapability && onChange) {
      onChange({
        serverId: selectedServer.id,
        serverName: selectedServer.name,
        capability: selectedCapability,
        parameters: newParams,
        timeout: 30000,
        retryCount: 3,
        errorHandling: 'stop'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          <CardTitle>MCP Server Node</CardTitle>
        </div>
        <CardDescription>Execute actions using MCP servers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enabledServers.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning rounded-md">
            <AlertCircle className="h-4 w-4 text-warning" />
            <span className="text-sm text-warning">No MCP servers enabled. Visit the MCP Catalog to enable servers.</span>
          </div>
        )}

        <div className="space-y-2">
          <Label>MCP Server</Label>
          <Select
            value={selectedServer?.id}
            onValueChange={handleServerChange}
            disabled={enabledServers.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an MCP server" />
            </SelectTrigger>
            <SelectContent>
              {enabledServers.map(server => (
                <SelectItem key={server.id} value={server.id}>
                  {server.name} - {server.provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedServer && (
          <>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">{selectedServer.category}</Badge>
              <Badge variant="outline">{selectedServer.capabilities.length} capabilities</Badge>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Capability</Label>
              <Select
                value={selectedCapability?.name}
                onValueChange={handleCapabilityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a capability" />
                </SelectTrigger>
                <SelectContent>
                  {selectedServer.capabilities.map(cap => (
                    <SelectItem key={cap.name} value={cap.name}>
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3" />
                        {cap.name} ({cap.type})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCapability && (
              <>
                <div className="text-sm text-muted-foreground">
                  {selectedCapability.description}
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Parameters</Label>
                  {selectedCapability.schema ? (
                    Object.entries(selectedCapability.schema).map(([key, spec]: [string, any]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-sm">
                          {key}
                          {spec.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Input
                          placeholder={spec.description || `Enter ${key}`}
                          value={parameters[key] || ''}
                          onChange={(e) => handleParameterChange(key, e.target.value)}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No parameters required
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {selectedServer && selectedCapability && (
          <Button className="w-full" variant="outline">
            Test Configuration
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MCPNode;
