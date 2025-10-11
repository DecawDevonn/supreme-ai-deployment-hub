import type { MCPNodeConfig, MCPNodeResult } from '@/types/nodes/mcpNode';
import { mcpCatalogService } from '@/services/mcp/mcpCatalogService';

export class MCPNodeService {
  async executeNode(config: MCPNodeConfig): Promise<MCPNodeResult> {
    const startTime = Date.now();
    const server = mcpCatalogService.getServerById(config.serverId);

    if (!server) {
      return {
        success: false,
        error: `Server ${config.serverId} not found`,
        executionTime: Date.now() - startTime,
        serverId: config.serverId,
        capabilityUsed: config.capability.name
      };
    }

    // Simulate MCP server execution
    try {
      await this.simulateExecution(config);
      
      const mockData = this.generateMockResponse(config);
      
      return {
        success: true,
        data: mockData,
        executionTime: Date.now() - startTime,
        serverId: config.serverId,
        capabilityUsed: config.capability.name
      };
    } catch (error) {
      if (config.errorHandling === 'fallback' && config.fallbackValue) {
        return {
          success: true,
          data: config.fallbackValue,
          executionTime: Date.now() - startTime,
          serverId: config.serverId,
          capabilityUsed: config.capability.name
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
        serverId: config.serverId,
        capabilityUsed: config.capability.name
      };
    }
  }

  private async simulateExecution(config: MCPNodeConfig): Promise<void> {
    // Simulate network delay
    const delay = Math.random() * 1000 + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate occasional failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Simulated MCP server error');
    }
  }

  private generateMockResponse(config: MCPNodeConfig): any {
    const { serverId, capability } = config;

    // Generate capability-specific mock responses
    switch (capability.type) {
      case 'tool':
        return this.generateToolResponse(serverId, capability.name);
      case 'resource':
        return this.generateResourceResponse(serverId, capability.name);
      case 'prompt':
        return this.generatePromptResponse(serverId, capability.name);
      default:
        return { message: 'Operation completed successfully' };
    }
  }

  private generateToolResponse(serverId: string, capabilityName: string): any {
    const responses: Record<string, any> = {
      create_issue: {
        id: `issue-${Math.floor(Math.random() * 10000)}`,
        number: Math.floor(Math.random() * 1000),
        title: 'Generated Issue',
        url: 'https://github.com/example/repo/issues/123',
        state: 'open'
      },
      send_message: {
        messageId: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        channel: '#general',
        status: 'sent'
      },
      search: {
        results: [
          { title: 'Result 1', url: 'https://example.com/1', snippet: 'Mock search result 1' },
          { title: 'Result 2', url: 'https://example.com/2', snippet: 'Mock search result 2' }
        ],
        total: 2
      },
      query: {
        documents: [
          { id: '1', data: { name: 'Document 1' } },
          { id: '2', data: { name: 'Document 2' } }
        ],
        count: 2
      }
    };

    return responses[capabilityName] || { success: true, message: `${capabilityName} executed` };
  }

  private generateResourceResponse(serverId: string, capabilityName: string): any {
    return {
      resourceId: `res-${Date.now()}`,
      type: capabilityName,
      data: {
        content: 'Mock resource content',
        metadata: {
          created: new Date().toISOString(),
          server: serverId
        }
      }
    };
  }

  private generatePromptResponse(serverId: string, capabilityName: string): any {
    return {
      prompt: `Generated prompt for ${capabilityName}`,
      suggestions: [
        'Suggestion 1',
        'Suggestion 2',
        'Suggestion 3'
      ]
    };
  }

  async validateConfiguration(config: MCPNodeConfig): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const server = mcpCatalogService.getServerById(config.serverId);

    if (!server) {
      errors.push(`Server ${config.serverId} not found`);
      return { valid: false, errors };
    }

    // Check if capability exists
    const hasCapability = server.capabilities.some(
      cap => cap.name === config.capability.name && cap.type === config.capability.type
    );

    if (!hasCapability) {
      errors.push(`Capability ${config.capability.name} not found on server ${server.name}`);
    }

    // Validate required parameters
    if (config.capability.schema) {
      const requiredParams = Object.entries(config.capability.schema)
        .filter(([_, spec]: [string, any]) => spec.required)
        .map(([key]) => key);

      for (const param of requiredParams) {
        if (!config.parameters[param]) {
          errors.push(`Required parameter ${param} is missing`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
}

export const mcpNodeService = new MCPNodeService();
