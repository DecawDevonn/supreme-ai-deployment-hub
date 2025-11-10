import { Workflow, WorkflowExecution, WorkflowTemplate, N8nCredentials } from '@/types/workflow';
import { supabase } from '@/integrations/supabase/client';

export class N8nService {
  async getWorkflows(): Promise<Workflow[]> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(this.mapFromDatabase);
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
      return this.getMockWorkflows();
    }
  }

  async getWorkflow(id: string): Promise<Workflow | null> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? this.mapFromDatabase(data) : null;
    } catch (error) {
      console.error('Failed to fetch workflow:', error);
      return null;
    }
  }

  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const dbWorkflow = this.mapToDatabase(workflow, user.id);
      
      const { data, error } = await supabase
        .from('workflows')
        .insert(dbWorkflow)
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDatabase(data);
    } catch (error) {
      console.error('Failed to create workflow:', error);
      throw error;
    }
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const dbWorkflow = this.mapToDatabase(workflow, user.id);
      
      const { data, error } = await supabase
        .from('workflows')
        .update(dbWorkflow)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDatabase(data);
    } catch (error) {
      console.error('Failed to update workflow:', error);
      throw error;
    }
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      return false;
    }
  }

  async executeWorkflow(id: string, data?: any): Promise<WorkflowExecution> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const execution = {
        workflow_id: id,
        status: 'pending',
        input_params: data || {},
        logs: []
      };

      const { data: result, error } = await supabase
        .from('workflow_runs')
        .insert(execution)
        .select()
        .single();

      if (error) throw error;

      return {
        id: result.id,
        workflowId: result.workflow_id,
        status: result.status as 'running' | 'success' | 'error' | 'waiting' | 'cancelled',
        startedAt: result.started_at,
        finishedAt: result.finished_at,
        executionData: result.output_data
      };
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      throw error;
    }
  }

  async getExecutions(workflowId?: string): Promise<WorkflowExecution[]> {
    try {
      let query = supabase
        .from('workflow_runs')
        .select('*')
        .order('started_at', { ascending: false });

      if (workflowId) {
        query = query.eq('workflow_id', workflowId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(run => ({
        id: run.id,
        workflowId: run.workflow_id,
        status: run.status as 'running' | 'success' | 'error' | 'waiting' | 'cancelled',
        startedAt: run.started_at,
        finishedAt: run.finished_at,
        executionData: run.output_data
      }));
    } catch (error) {
      console.error('Failed to fetch executions:', error);
      return [];
    }
  }

  async getCredentials(): Promise<N8nCredentials[]> {
    // Credentials are not implemented in this version
    return [];
  }

  private mapFromDatabase(dbWorkflow: any): Workflow {
    const definition = dbWorkflow.definition || {};
    return {
      id: dbWorkflow.id,
      name: dbWorkflow.name,
      description: dbWorkflow.description || '',
      active: definition.active || false,
      nodes: definition.nodes || [],
      connections: definition.connections || {},
      createdAt: dbWorkflow.created_at,
      updatedAt: dbWorkflow.updated_at,
      category: definition.category,
      tags: definition.tags || []
    };
  }

  private mapToDatabase(workflow: Partial<Workflow>, userId: string): any {
    return {
      name: workflow.name,
      description: workflow.description,
      user_id: userId,
      definition: {
        active: workflow.active,
        nodes: workflow.nodes,
        connections: workflow.connections,
        category: workflow.category,
        tags: workflow.tags
      }
    };
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
        id: 'devonn-production-batch',
        name: 'Devonn.AI Production Batch Video Pipeline',
        description: 'Automated cron-scheduled workflow for script × character × voice permutation generation with Yapper, multi-character swaps, FFmpeg processing, quality checks, HITL review, and cloud upload',
        category: 'ai-agent',
        popularity: 98,
        featured: true,
        workflow: {
          name: 'DevonnAI_Production_Batch_Video_Pipeline',
          category: 'ai-agent',
          nodes: [
            {
              id: 'cron-trigger',
              type: 'cron',
              name: 'Cron Trigger',
              parameters: {
                cronExpression: '0 2 * * *',
                description: 'Daily execution at 2 AM'
              },
              position: { x: 200, y: 200 }
            },
            {
              id: 'permutation-gen',
              type: 'agent',
              name: 'Permutation Generator',
              parameters: {
                task: 'Generate script × character × voice permutations',
                model: 'gpt-4'
              },
              position: { x: 400, y: 200 }
            },
            {
              id: 'batch-split',
              type: 'stage',
              name: 'Split In Batches',
              parameters: {
                batchSize: 5,
                description: 'Concurrency control for parallel processing'
              },
              position: { x: 600, y: 200 }
            },
            {
              id: 'yapper-upload',
              type: 'tool',
              name: 'Upload Script to Yapper',
              parameters: {
                platform: 'Yapper',
                operation: 'upload'
              },
              position: { x: 800, y: 200 }
            },
            {
              id: 'voice-char-integration',
              type: 'agent',
              name: 'Voice + Character Integration',
              parameters: {
                task: 'Integrate ElevenLabs voice with character style'
              },
              position: { x: 1000, y: 200 }
            },
            {
              id: 'multi-char-swap',
              type: 'tool',
              name: 'Multi-Character Swap',
              parameters: {
                platform: 'Luma',
                operation: 'modify-video'
              },
              position: { x: 1200, y: 200 }
            },
            {
              id: 'ffmpeg-process',
              type: 'agent',
              name: 'FFmpeg Processing',
              parameters: {
                task: 'Dynamic video processing: trim, resize, watermark, audio normalization'
              },
              position: { x: 1400, y: 200 }
            },
            {
              id: 'quality-check',
              type: 'agent',
              name: 'Quality Check',
              parameters: {
                task: 'Automated quality validation: resolution, lip-sync, artifact detection'
              },
              position: { x: 1600, y: 200 }
            },
            {
              id: 'hitl-retry',
              type: 'stage',
              name: 'HITL / Retry Decision',
              parameters: {
                description: 'Route to HITL review or retry (max 2 attempts)'
              },
              position: { x: 1800, y: 200 }
            },
            {
              id: 'hitl-queue',
              type: 'stage',
              name: 'HITL Queue',
              parameters: {
                description: 'Human-in-the-loop review queue'
              },
              position: { x: 2000, y: 100 }
            },
            {
              id: 'failed-queue',
              type: 'stage',
              name: 'Failed Queue',
              parameters: {
                description: 'Failed videos after max retries'
              },
              position: { x: 2000, y: 300 }
            },
            {
              id: 'cloud-upload',
              type: 'tool',
              name: 'Upload Approved Video',
              parameters: {
                platform: 'CloudStorage',
                operation: 'upload'
              },
              position: { x: 2200, y: 100 }
            },
            {
              id: 'knowledge-graph',
              type: 'agent',
              name: 'Update Knowledge Graph',
              parameters: {
                task: 'Store metadata: character_id, voice_id, script_id, video_url'
              },
              position: { x: 2400, y: 100 }
            },
            {
              id: 'analytics-logger',
              type: 'agent',
              name: 'Analytics Logger',
              parameters: {
                task: 'Log all execution data for analysis'
              },
              position: { x: 2200, y: 300 }
            }
          ]
        }
      },
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