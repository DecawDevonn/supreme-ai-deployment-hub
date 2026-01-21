// MCP Server Registry - Predefined MCP server configurations

export interface McpServerConfig {
  id: string;
  name: string;
  description: string;
  category: "hosting" | "development" | "ai" | "automation" | "data" | "custom";
  icon?: string;
  
  // Connection configuration
  type: "stdio" | "http" | "sse";
  command?: string;
  args?: string[];
  gatewayUrl?: string;
  
  // Authentication
  auth?: {
    type: "api_token" | "oauth" | "basic" | "none";
    envVar?: string;
    description?: string;
  };
  
  // Environment variables template
  env?: Record<string, string>;
  
  // Documentation
  docsUrl?: string;
  setupInstructions?: string;
}

export interface McpServerConnection extends McpServerConfig {
  isConnected: boolean;
  apiToken?: string;
  lastConnected?: Date;
}

// Pre-configured MCP servers
export const MCP_SERVER_REGISTRY: McpServerConfig[] = [
  {
    id: "hostinger",
    name: "Hostinger",
    description: "Manage domains, hosting, VPS, and DNS through Hostinger API",
    category: "hosting",
    type: "stdio",
    command: "npx",
    args: ["hostinger-api-mcp@latest"],
    auth: {
      type: "api_token",
      envVar: "API_TOKEN",
      description: "Enter your Hostinger API token (get it from hPanel → API section)",
    },
    env: {
      API_TOKEN: "",
    },
    docsUrl: "https://developers.hostinger.com",
    setupInstructions: "1. Log into Hostinger hPanel\n2. Go to API section\n3. Generate a new API token\n4. Paste the token below",
  },
  {
    id: "docker-mcp-gateway",
    name: "Docker MCP Gateway",
    description: "Local Docker-based MCP gateway for bundled tools (DuckDuckGo, GitHub, Filesystem)",
    category: "development",
    type: "http",
    gatewayUrl: "http://localhost:8080/mcp",
    auth: {
      type: "none",
    },
    setupInstructions: "Run the Docker MCP Gateway container:\ndocker run -p 8080:8080 mcp-gateway",
  },
  {
    id: "github-mcp",
    name: "GitHub",
    description: "Manage repositories, issues, pull requests, and GitHub Actions",
    category: "development",
    type: "stdio",
    command: "npx",
    args: ["@modelcontextprotocol/server-github"],
    auth: {
      type: "api_token",
      envVar: "GITHUB_TOKEN",
      description: "GitHub Personal Access Token with repo permissions",
    },
    env: {
      GITHUB_TOKEN: "",
    },
    docsUrl: "https://github.com/modelcontextprotocol/servers",
  },
  {
    id: "filesystem-mcp",
    name: "Filesystem",
    description: "Read and write files on the local filesystem",
    category: "development",
    type: "stdio",
    command: "npx",
    args: ["@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"],
    auth: {
      type: "none",
    },
    docsUrl: "https://github.com/modelcontextprotocol/servers",
  },
  {
    id: "slack-mcp",
    name: "Slack",
    description: "Send messages, manage channels, and interact with Slack workspaces",
    category: "automation",
    type: "stdio",
    command: "npx",
    args: ["@modelcontextprotocol/server-slack"],
    auth: {
      type: "api_token",
      envVar: "SLACK_TOKEN",
      description: "Slack Bot Token (xoxb-...)",
    },
    env: {
      SLACK_TOKEN: "",
    },
    docsUrl: "https://api.slack.com/docs",
  },
  {
    id: "devonn-gateway",
    name: "DEVONN.AI Gateway",
    description: "Connect to DEVONN.AI's central MCP gateway for unified tool access",
    category: "ai",
    type: "http",
    gatewayUrl: "https://api.devonn.ai/mcp",
    auth: {
      type: "api_token",
      envVar: "DEVONN_API_KEY",
      description: "DEVONN.AI API key from your dashboard",
    },
  },
  {
    id: "custom",
    name: "Custom Server",
    description: "Configure a custom MCP server endpoint",
    category: "custom",
    type: "http",
    gatewayUrl: "",
    auth: {
      type: "none",
    },
  },
];

// Get server by ID
export function getServerConfig(id: string): McpServerConfig | undefined {
  return MCP_SERVER_REGISTRY.find((s) => s.id === id);
}

// Get servers by category
export function getServersByCategory(category: McpServerConfig["category"]): McpServerConfig[] {
  return MCP_SERVER_REGISTRY.filter((s) => s.category === category);
}

// Category metadata
export const SERVER_CATEGORIES = {
  hosting: { label: "Hosting & Infrastructure", icon: "Server" },
  development: { label: "Development Tools", icon: "Code" },
  ai: { label: "AI & ML", icon: "Brain" },
  automation: { label: "Automation", icon: "Zap" },
  data: { label: "Data & Analytics", icon: "Database" },
  custom: { label: "Custom", icon: "Settings" },
} as const;
