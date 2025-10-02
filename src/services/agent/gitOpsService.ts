import { apiClient, handleServiceError } from '../config';
import { GitRepository, GitBranch } from '../git/types';

export interface GitOpsTask {
  id: string;
  type: 'create_branch' | 'create_pr' | 'merge_pr' | 'resolve_conflict' | 'trigger_deploy';
  repository: GitRepository;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface GitOpsWorkflow {
  id: string;
  name: string;
  repository: GitRepository;
  tasks: GitOpsTask[];
  status: 'active' | 'paused' | 'completed';
  automationRules: AutomationRule[];
}

export interface AutomationRule {
  trigger: 'commit' | 'pr_opened' | 'pr_merged' | 'build_success' | 'build_failed';
  action: 'create_branch' | 'create_pr' | 'merge_pr' | 'notify' | 'deploy';
  conditions?: Record<string, any>;
}

export interface ConflictAnalysis {
  hasConflicts: boolean;
  conflictingFiles: string[];
  suggestedResolution?: string;
  confidence: number;
}

export const GitOpsAgentService = {
  /**
   * Create an autonomous GitOps workflow
   */
  createWorkflow: async (repositoryId: string, name: string, rules: AutomationRule[]): Promise<GitOpsWorkflow> => {
    try {
      const response = await apiClient.post('/gitops/workflows', {
        repositoryId,
        name,
        automationRules: rules
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error creating GitOps workflow');
    }
  },

  /**
   * Autonomous branch creation with intelligent naming
   */
  createBranchAutonomous: async (
    repositoryId: string,
    taskDescription: string,
    baseBranch: string = 'main'
  ): Promise<GitOpsTask> => {
    try {
      const response = await apiClient.post('/gitops/branch/create', {
        repositoryId,
        taskDescription,
        baseBranch
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error creating branch autonomously');
    }
  },

  /**
   * Autonomous pull request creation with AI-generated description
   */
  createPRAutonomous: async (
    repositoryId: string,
    sourceBranch: string,
    targetBranch: string,
    context?: string
  ): Promise<GitOpsTask> => {
    try {
      const response = await apiClient.post('/gitops/pr/create', {
        repositoryId,
        sourceBranch,
        targetBranch,
        context
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error creating PR autonomously');
    }
  },

  /**
   * Analyze merge conflicts and suggest resolutions
   */
  analyzeConflicts: async (
    repositoryId: string,
    sourceBranch: string,
    targetBranch: string
  ): Promise<ConflictAnalysis> => {
    try {
      const response = await apiClient.post('/gitops/conflicts/analyze', {
        repositoryId,
        sourceBranch,
        targetBranch
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error analyzing conflicts');
    }
  },

  /**
   * Autonomous conflict resolution
   */
  resolveConflictAutonomous: async (
    repositoryId: string,
    conflictPath: string,
    strategy: 'ours' | 'theirs' | 'ai_merge'
  ): Promise<GitOpsTask> => {
    try {
      const response = await apiClient.post('/gitops/conflicts/resolve', {
        repositoryId,
        conflictPath,
        strategy
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error resolving conflict autonomously');
    }
  },

  /**
   * Review pull request with AI analysis
   */
  reviewPRAutonomous: async (
    repositoryId: string,
    prNumber: number
  ): Promise<{
    approved: boolean;
    comments: string[];
    suggestions: string[];
  }> => {
    try {
      const response = await apiClient.post('/gitops/pr/review', {
        repositoryId,
        prNumber
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error reviewing PR autonomously');
    }
  },

  /**
   * Autonomous PR merge with safety checks
   */
  mergePRAutonomous: async (
    repositoryId: string,
    prNumber: number,
    mergeStrategy: 'merge' | 'squash' | 'rebase' = 'merge'
  ): Promise<GitOpsTask> => {
    try {
      const response = await apiClient.post('/gitops/pr/merge', {
        repositoryId,
        prNumber,
        mergeStrategy
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error merging PR autonomously');
    }
  },

  /**
   * Monitor CI/CD pipeline status
   */
  monitorPipeline: async (repositoryId: string, branchName: string): Promise<{
    status: 'pending' | 'running' | 'success' | 'failed';
    buildUrl?: string;
    logs?: string[];
    duration?: number;
  }> => {
    try {
      const response = await apiClient.get(`/gitops/pipeline/${repositoryId}/${branchName}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error monitoring pipeline');
    }
  },

  /**
   * Trigger deployment after successful merge
   */
  triggerDeployment: async (
    repositoryId: string,
    environment: 'staging' | 'production',
    branch: string
  ): Promise<GitOpsTask> => {
    try {
      const response = await apiClient.post('/gitops/deploy', {
        repositoryId,
        environment,
        branch
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error triggering deployment');
    }
  },

  /**
   * Generate changelog from merged PRs
   */
  generateChangelog: async (
    repositoryId: string,
    fromTag?: string,
    toTag?: string
  ): Promise<string> => {
    try {
      const response = await apiClient.post('/gitops/changelog', {
        repositoryId,
        fromTag,
        toTag
      });
      return response.data.changelog;
    } catch (error) {
      return handleServiceError(error, 'Error generating changelog');
    }
  },

  /**
   * Get workflow status and history
   */
  getWorkflowStatus: async (workflowId: string): Promise<GitOpsWorkflow> => {
    try {
      const response = await apiClient.get(`/gitops/workflows/${workflowId}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching workflow status');
    }
  },

  /**
   * Get all tasks for a repository
   */
  listTasks: async (repositoryId: string): Promise<GitOpsTask[]> => {
    try {
      const response = await apiClient.get(`/gitops/tasks/${repositoryId}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error listing tasks');
    }
  }
};
