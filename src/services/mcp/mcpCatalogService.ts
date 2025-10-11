import type { MCPServer, MCPCatalog, MCPServerCategory } from '@/types/mcp';

// Mock MCP server catalog based on Docker Hub research
const mockServers: MCPServer[] = [
  {
    id: 'github-mcp',
    name: 'GitHub MCP Server',
    description: 'Interact with GitHub repositories, issues, pull requests, and more',
    category: 'developer-tools',
    provider: 'GitHub',
    dockerImage: 'mcp/github-server',
    version: '1.2.0',
    downloads: 150000,
    stars: 890,
    tags: ['git', 'version-control', 'collaboration'],
    capabilities: [
      { type: 'tool', name: 'create_issue', description: 'Create GitHub issues' },
      { type: 'tool', name: 'list_repositories', description: 'List user repositories' },
      { type: 'resource', name: 'repository', description: 'Access repository data' }
    ],
    configuration: {
      requiredSecrets: ['GITHUB_TOKEN'],
      environmentVariables: {},
      ports: [8080]
    }
  },
  {
    id: 'aws-mcp',
    name: 'AWS MCP Server',
    description: 'Manage AWS resources including S3, EC2, Lambda, and more',
    category: 'developer-tools',
    provider: 'Amazon Web Services',
    dockerImage: 'mcp/aws-server',
    version: '2.1.0',
    downloads: 120000,
    stars: 756,
    tags: ['cloud', 'aws', 'infrastructure'],
    capabilities: [
      { type: 'tool', name: 's3_upload', description: 'Upload files to S3' },
      { type: 'tool', name: 'lambda_invoke', description: 'Invoke Lambda functions' },
      { type: 'resource', name: 'ec2_instance', description: 'Manage EC2 instances' }
    ],
    configuration: {
      requiredSecrets: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
      environmentVariables: { AWS_REGION: 'us-east-1' },
      ports: [8081]
    }
  },
  {
    id: 'mongodb-mcp',
    name: 'MongoDB MCP Server',
    description: 'Query and manage MongoDB databases',
    category: 'databases',
    provider: 'MongoDB',
    dockerImage: 'mcp/mongodb-server',
    version: '1.0.5',
    downloads: 85000,
    stars: 542,
    tags: ['database', 'nosql', 'mongodb'],
    capabilities: [
      { type: 'tool', name: 'query', description: 'Execute MongoDB queries' },
      { type: 'tool', name: 'insert', description: 'Insert documents' },
      { type: 'resource', name: 'collection', description: 'Access collections' }
    ],
    configuration: {
      requiredSecrets: ['MONGODB_URI'],
      environmentVariables: {},
      ports: [8082]
    }
  },
  {
    id: 'brave-search-mcp',
    name: 'Brave Search MCP',
    description: 'Search the web using Brave Search API',
    category: 'search',
    provider: 'Brave',
    dockerImage: 'mcp/brave-search',
    version: '1.3.2',
    downloads: 95000,
    stars: 623,
    tags: ['search', 'web', 'api'],
    capabilities: [
      { type: 'tool', name: 'search', description: 'Search the web' },
      { type: 'tool', name: 'news_search', description: 'Search news articles' }
    ],
    configuration: {
      requiredSecrets: ['BRAVE_API_KEY'],
      environmentVariables: {},
      ports: [8083]
    }
  },
  {
    id: 'notion-mcp',
    name: 'Notion MCP Server',
    description: 'Manage Notion pages, databases, and content',
    category: 'productivity',
    provider: 'Notion',
    dockerImage: 'mcp/notion-server',
    version: '1.1.0',
    downloads: 110000,
    stars: 701,
    tags: ['productivity', 'notes', 'collaboration'],
    capabilities: [
      { type: 'tool', name: 'create_page', description: 'Create Notion pages' },
      { type: 'tool', name: 'query_database', description: 'Query Notion databases' },
      { type: 'resource', name: 'page', description: 'Access page content' }
    ],
    configuration: {
      requiredSecrets: ['NOTION_API_KEY'],
      environmentVariables: {},
      ports: [8084],
      oauth: {
        provider: 'notion',
        scopes: ['read', 'write']
      }
    }
  },
  {
    id: 'stripe-mcp',
    name: 'Stripe MCP Server',
    description: 'Process payments and manage Stripe resources',
    category: 'finance',
    provider: 'Stripe',
    dockerImage: 'mcp/stripe-server',
    version: '1.4.1',
    downloads: 72000,
    stars: 489,
    tags: ['payments', 'finance', 'api'],
    capabilities: [
      { type: 'tool', name: 'create_payment', description: 'Create payment intents' },
      { type: 'tool', name: 'list_customers', description: 'List customers' },
      { type: 'resource', name: 'invoice', description: 'Access invoices' }
    ],
    configuration: {
      requiredSecrets: ['STRIPE_SECRET_KEY'],
      environmentVariables: {},
      ports: [8085]
    }
  },
  {
    id: 'grafana-mcp',
    name: 'Grafana MCP Server',
    description: 'Monitor and visualize metrics with Grafana',
    category: 'monitoring',
    provider: 'Grafana Labs',
    dockerImage: 'mcp/grafana-server',
    version: '1.0.3',
    downloads: 45000,
    stars: 312,
    tags: ['monitoring', 'metrics', 'observability'],
    capabilities: [
      { type: 'tool', name: 'create_dashboard', description: 'Create Grafana dashboards' },
      { type: 'tool', name: 'query_metrics', description: 'Query metrics' },
      { type: 'resource', name: 'dashboard', description: 'Access dashboards' }
    ],
    configuration: {
      requiredSecrets: ['GRAFANA_API_KEY'],
      environmentVariables: { GRAFANA_URL: 'http://localhost:3000' },
      ports: [8086]
    }
  },
  {
    id: 'slack-mcp',
    name: 'Slack MCP Server',
    description: 'Send messages and interact with Slack workspaces',
    category: 'productivity',
    provider: 'Slack',
    dockerImage: 'mcp/slack-server',
    version: '1.2.4',
    downloads: 98000,
    stars: 645,
    tags: ['communication', 'collaboration', 'messaging'],
    capabilities: [
      { type: 'tool', name: 'send_message', description: 'Send Slack messages' },
      { type: 'tool', name: 'list_channels', description: 'List workspace channels' }
    ],
    configuration: {
      requiredSecrets: ['SLACK_BOT_TOKEN'],
      environmentVariables: {},
      ports: [8087],
      oauth: {
        provider: 'slack',
        scopes: ['chat:write', 'channels:read']
      }
    }
  }
];

export class MCPCatalogService {
  private servers: MCPServer[] = mockServers;

  getCatalog(): MCPCatalog {
    const categories = this.getCategories();
    const featured = this.servers
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 4)
      .map(s => s.id);
    const trending = this.servers
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 4)
      .map(s => s.id);

    return {
      servers: this.servers,
      categories,
      featured,
      trending
    };
  }

  getCategories() {
    const categoryMap = new Map<MCPServerCategory, string[]>();
    
    this.servers.forEach(server => {
      const existing = categoryMap.get(server.category) || [];
      categoryMap.set(server.category, [...existing, server.id]);
    });

    return Array.from(categoryMap.entries()).map(([category, serverIds]) => ({
      name: category,
      count: serverIds.length,
      servers: serverIds
    }));
  }

  getServerById(id: string): MCPServer | undefined {
    return this.servers.find(s => s.id === id);
  }

  getServersByCategory(category: MCPServerCategory): MCPServer[] {
    return this.servers.filter(s => s.category === category);
  }

  searchServers(query: string): MCPServer[] {
    const lowerQuery = query.toLowerCase();
    return this.servers.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery) ||
      s.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      s.provider.toLowerCase().includes(lowerQuery)
    );
  }

  getFeaturedServers(): MCPServer[] {
    return this.servers
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 6);
  }

  getTrendingServers(): MCPServer[] {
    return this.servers
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 6);
  }
}

export const mcpCatalogService = new MCPCatalogService();
