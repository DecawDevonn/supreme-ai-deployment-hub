import type { MCPServer, MCPCapability } from '@/types/mcp';

export interface MCPNodeConfig {
  serverId: string;
  serverName: string;
  capability: MCPCapability;
  parameters: Record<string, any>;
  timeout?: number;
  retryCount?: number;
  errorHandling?: 'stop' | 'continue' | 'fallback';
  fallbackValue?: any;
}

export interface MCPNodeResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  serverId: string;
  capabilityUsed: string;
}

export interface MCPNodeMetadata {
  server: MCPServer;
  availableCapabilities: MCPCapability[];
  lastExecution?: {
    timestamp: string;
    result: MCPNodeResult;
  };
}
