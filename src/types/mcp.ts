export type MCPServerCategory = 
  | 'developer-tools'
  | 'databases'
  | 'search'
  | 'productivity'
  | 'finance'
  | 'monitoring'
  | 'custom';

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  category: MCPServerCategory;
  provider: string;
  dockerImage: string;
  version: string;
  downloads: number;
  stars: number;
  tags: string[];
  capabilities: MCPCapability[];
  configuration: MCPServerConfig;
  status?: MCPServerStatus;
  enabled?: boolean;
}

export interface MCPCapability {
  type: 'tool' | 'resource' | 'prompt';
  name: string;
  description: string;
  schema?: Record<string, any>;
}

export interface MCPServerConfig {
  requiredSecrets: string[];
  environmentVariables: Record<string, string>;
  ports: number[];
  oauth?: {
    provider: string;
    scopes: string[];
  };
}

export interface MCPServerStatus {
  running: boolean;
  containerId?: string;
  uptime?: number;
  lastError?: string;
  metrics?: {
    requestCount: number;
    errorRate: number;
    avgResponseTime: number;
  };
}

export interface MCPGatewayConfig {
  port: number;
  servers: string[];
  monitoring: boolean;
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    tracing: boolean;
  };
}

export interface MCPCatalog {
  servers: MCPServer[];
  categories: {
    name: string;
    count: number;
    servers: string[];
  }[];
  featured: string[];
  trending: string[];
}
