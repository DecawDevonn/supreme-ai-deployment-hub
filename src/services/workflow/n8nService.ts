import { Workflow, WorkflowExecution, WorkflowTemplate, N8nCredentials } from '@/types/workflow';

export class N8nService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = 'http://localhost:5678', apiKey: string = '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}/api/v1${endpoint}`, {
      ...options,
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`n8n API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getWorkflows(): Promise<Workflow[]> {
    try {
      const data = await this.request('/workflows');
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
      return this.getMockWorkflows();
    }
  }

  async getWorkflow(id: string): Promise<Workflow | null> {
    try {
      const data = await this.request(`/workflows/${id}`);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch workflow:', error);
      return null;
    }
  }

  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    try {
      const data = await this.request('/workflows', {
        method: 'POST',
        body: JSON.stringify(workflow),
      });
      return data.data;
    } catch (error) {
      console.error('Failed to create workflow:', error);
      throw error;
    }
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    try {
      const data = await this.request(`/workflows/${id}`, {
        method: 'PUT',
        body: JSON.stringify(workflow),
      });
      return data.data;
    } catch (error) {
      console.error('Failed to update workflow:', error);
      throw error;
    }
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    try {
      await this.request(`/workflows/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      return false;
    }
  }

  async executeWorkflow(id: string, data?: any): Promise<WorkflowExecution> {
    try {
      const response = await this.request(`/workflows/${id}/execute`, {
        method: 'POST',
        body: JSON.stringify({ data }),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      throw error;
    }
  }

  async getExecutions(workflowId?: string): Promise<WorkflowExecution[]> {
    try {
      const endpoint = workflowId ? `/executions?workflowId=${workflowId}` : '/executions';
      const data = await this.request(endpoint);
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch executions:', error);
      return [];
    }
  }

  async getCredentials(): Promise<N8nCredentials[]> {
    try {
      const data = await this.request('/credentials');
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
      return [];
    }
  }

  // Mock data for development
  private getMockWorkflows(): Workflow[] {
    return [
      {
        id: '1',
        name: 'Deploy to AWS',
        description: 'Automated deployment pipeline to AWS EKS',
        active: true,
        nodes: [],
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'deployment',
        tags: ['aws', 'kubernetes', 'deployment']
      },
      {
        id: '2',
        name: 'AI Agent Notification',
        description: 'Send notifications when AI agents complete tasks',
        active: true,
        nodes: [],
        connections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'ai-agent',
        tags: ['notification', 'ai', 'slack']
      }
    ];
  }

  getWorkflowTemplates(): WorkflowTemplate[] {
    return [
      {
        id: 'film-ai-enhanced',
        name: 'AI-Enhanced Film Production',
        description: 'Complete AI-powered filmmaking pipeline from script to final footage using LTX Studio',
        category: 'ai-agent',
        popularity: 92,
        featured: true,
        workflow: {
          name: 'AI-Enhanced Film Production',
          category: 'ai-agent',
          nodes: [
            {
              id: 'script-upload',
              type: 'stage',
              name: 'Script Upload',
              parameters: {
                description: 'Upload and parse the film script',
                source: 'LTX Studio'
              },
              position: { x: 100, y: 100 }
            },
            {
              id: 'ltx-storyboard',
              type: 'tool',
              name: 'LTX Storyboarding',
              parameters: {
                platform: 'LTX Studio',
                autoGenerate: true
              },
              position: { x: 300, y: 100 }
            },
            {
              id: 'script-parser',
              type: 'agent',
              name: 'Script Parser Agent',
              parameters: {
                model: 'gpt-4',
                task: 'Parse and structure script elements'
              },
              position: { x: 500, y: 50 }
            },
            {
              id: 'visual-synth',
              type: 'agent',
              name: 'Visual Synthesizer',
              parameters: {
                model: 'stable-diffusion',
                task: 'Generate visual assets from script descriptions'
              },
              position: { x: 700, y: 50 }
            },
            {
              id: 'sequencer',
              type: 'agent',
              name: 'Scene Sequencer',
              parameters: {
                task: 'Assemble and sequence generated scenes'
              },
              position: { x: 900, y: 100 }
            },
            {
              id: 'prop-forge',
              type: 'agent',
              name: 'Prop Forge',
              parameters: {
                task: 'Generate and integrate 3D props'
              },
              position: { x: 500, y: 200 }
            },
            {
              id: 'compositor',
              type: 'agent',
              name: 'Scene Compositor',
              parameters: {
                task: 'Blend footage and AI-generated elements'
              },
              position: { x: 700, y: 200 }
            },
            {
              id: 'post-fx',
              type: 'agent',
              name: 'Post FX',
              parameters: {
                task: 'Apply color grading and final effects'
              },
              position: { x: 1100, y: 100 }
            }
          ]
        }
      },
      {
        id: 'deploy-k8s',
        name: 'Kubernetes Deployment',
        description: 'Complete CI/CD pipeline for Kubernetes deployments',
        category: 'deployment',
        popularity: 95,
        featured: true,
        workflow: {
          name: 'Kubernetes Deployment Pipeline',
          category: 'deployment',
          nodes: [
            {
              id: 'trigger',
              type: 'webhook',
              name: 'Webhook Trigger',
              parameters: {},
              position: { x: 100, y: 100 }
            },
            {
              id: 'build',
              type: 'docker',
              name: 'Build Docker Image',
              parameters: {},
              position: { x: 300, y: 100 }
            },
            {
              id: 'deploy',
              type: 'kubernetes',
              name: 'Deploy to K8s',
              parameters: {},
              position: { x: 500, y: 100 }
            }
          ]
        }
      },
      {
        id: 'ai-chat-workflow',
        name: 'AI Chat Integration',
        description: 'Connect AI agents with multiple chat platforms',
        category: 'ai-agent',
        popularity: 88,
        featured: true,
        workflow: {
          name: 'AI Chat Integration',
          category: 'ai-agent',
          nodes: [
            {
              id: 'chat-trigger',
              type: 'slack',
              name: 'Slack Message',
              parameters: {},
              position: { x: 100, y: 100 }
            },
            {
              id: 'ai-process',
              type: 'openai',
              name: 'Process with AI',
              parameters: {},
              position: { x: 300, y: 100 }
            },
            {
              id: 'respond',
              type: 'slack',
              name: 'Send Response',
              parameters: {},
              position: { x: 500, y: 100 }
            }
          ]
        }
      }
    ];
  }
}

export const n8nService = new N8nService();