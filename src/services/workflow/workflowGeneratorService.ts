import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface WorkflowGenerationRequest {
  prompt: string;
}

export interface WorkflowGenerationResult {
  domain: string;
  workflow: {
    nodes: any[];
    connections: any;
  };
  template: any;
}

// Base templates for different domains
const domainTemplates: Record<string, any> = {
  creative: {
    name: 'Creative Workflow',
    meta: {
      instanceId: crypto.randomUUID(),
    },
    nodes: [],
    connections: {},
    settings: {
      executionOrder: 'v1',
    },
  },
  productivity: {
    name: 'Productivity Workflow',
    meta: {
      instanceId: crypto.randomUUID(),
    },
    nodes: [],
    connections: {},
    settings: {
      executionOrder: 'v1',
    },
  },
  analytics: {
    name: 'Analytics Workflow',
    meta: {
      instanceId: crypto.randomUUID(),
    },
    nodes: [],
    connections: {},
    settings: {
      executionOrder: 'v1',
    },
  },
  sales: {
    name: 'Sales Workflow',
    meta: {
      instanceId: crypto.randomUUID(),
    },
    nodes: [],
    connections: {},
    settings: {
      executionOrder: 'v1',
    },
  },
  deployment: {
    name: 'Deployment Workflow',
    meta: {
      instanceId: crypto.randomUUID(),
    },
    nodes: [],
    connections: {},
    settings: {
      executionOrder: 'v1',
    },
  },
  automation: {
    name: 'Automation Workflow',
    meta: {
      instanceId: crypto.randomUUID(),
    },
    nodes: [],
    connections: {},
    settings: {
      executionOrder: 'v1',
    },
  },
  integration: {
    name: 'Integration Workflow',
    meta: {
      instanceId: crypto.randomUUID(),
    },
    nodes: [],
    connections: {},
    settings: {
      executionOrder: 'v1',
    },
  },
  notification: {
    name: 'Notification Workflow',
    meta: {
      instanceId: crypto.randomUUID(),
    },
    nodes: [],
    connections: {},
    settings: {
      executionOrder: 'v1',
    },
  },
};

export class WorkflowGeneratorService {
  /**
   * Stage 1: Classify the user's prompt into a workflow domain
   */
  private async classifyWorkflowDomain(prompt: string): Promise<string> {
    logger.info('Stage 1: Classifying workflow domain', { prompt });

    const { data, error } = await supabase.functions.invoke('classify-workflow-domain', {
      body: { prompt },
    });

    if (error) {
      logger.error('Failed to classify workflow domain', { error });
      throw new Error(`Domain classification failed: ${error.message}`);
    }

    if (!data?.domain) {
      throw new Error('Invalid response from domain classifier');
    }

    logger.info('Domain classified', { domain: data.domain });
    return data.domain;
  }

  /**
   * Stage 2: Generate the workflow JSON based on domain and prompt
   */
  private async generateWorkflowJSON(
    prompt: string,
    domain: string,
    template: any
  ): Promise<any> {
    logger.info('Stage 2: Generating workflow JSON', { domain });

    const { data, error } = await supabase.functions.invoke('generate-workflow-json', {
      body: {
        prompt,
        domain,
        template,
      },
    });

    if (error) {
      logger.error('Failed to generate workflow JSON', { error });
      throw new Error(`Workflow generation failed: ${error.message}`);
    }

    if (!data?.workflow) {
      throw new Error('Invalid response from workflow generator');
    }

    logger.info('Workflow JSON generated successfully', {
      nodeCount: data.workflow.nodes?.length || 0,
    });

    return data.workflow;
  }

  /**
   * Main method: Generate a complete workflow from a natural language prompt
   */
  async generateWorkflow(request: WorkflowGenerationRequest): Promise<WorkflowGenerationResult> {
    try {
      logger.info('Starting workflow generation', { prompt: request.prompt });

      // Stage 1: Classify domain
      const domain = await this.classifyWorkflowDomain(request.prompt);

      // Get the appropriate template
      const template = domainTemplates[domain] || domainTemplates.automation;

      // Stage 2: Generate workflow
      const workflow = await this.generateWorkflowJSON(request.prompt, domain, template);

      // Merge with template metadata
      const completeWorkflow = {
        ...template,
        nodes: workflow.nodes,
        connections: workflow.connections,
        name: workflow.name || `${domain.charAt(0).toUpperCase() + domain.slice(1)} Workflow`,
      };

      logger.info('Workflow generation completed', { domain });

      return {
        domain,
        workflow: completeWorkflow,
        template,
      };
    } catch (error) {
      logger.error('Workflow generation failed', { error });
      throw error;
    }
  }

  /**
   * Get available domain templates
   */
  getAvailableDomains(): string[] {
    return Object.keys(domainTemplates);
  }

  /**
   * Get a specific domain template
   */
  getDomainTemplate(domain: string): any {
    return domainTemplates[domain] || domainTemplates.automation;
  }
}

export const workflowGeneratorService = new WorkflowGeneratorService();
