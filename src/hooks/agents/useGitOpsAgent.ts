import { useState, useCallback } from 'react';
import { GitOpsAgentService, GitOpsTask, GitOpsWorkflow, AutomationRule } from '@/services/agent/gitOpsService';
import { GitRepository } from '@/services/git';
import { toast } from 'sonner';

export function useGitOpsAgent(repository?: GitRepository) {
  const [workflows, setWorkflows] = useState<GitOpsWorkflow[]>([]);
  const [tasks, setTasks] = useState<GitOpsTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<GitOpsWorkflow | null>(null);

  const createWorkflow = useCallback(async (name: string, rules: AutomationRule[]) => {
    if (!repository) {
      toast.error('No repository selected');
      return;
    }

    setLoading(true);
    try {
      const workflow = await GitOpsAgentService.createWorkflow(repository.id, name, rules);
      setWorkflows(prev => [...prev, workflow]);
      toast.success(`Workflow "${name}" created successfully`);
      return workflow;
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast.error('Failed to create workflow');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const createBranch = useCallback(async (taskDescription: string, baseBranch: string = 'main') => {
    if (!repository) {
      toast.error('No repository selected');
      return;
    }

    setLoading(true);
    try {
      const task = await GitOpsAgentService.createBranchAutonomous(
        repository.id,
        taskDescription,
        baseBranch
      );
      setTasks(prev => [...prev, task]);
      toast.success('Branch creation initiated');
      return task;
    } catch (error) {
      console.error('Error creating branch:', error);
      toast.error('Failed to create branch');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const createPullRequest = useCallback(async (
    sourceBranch: string,
    targetBranch: string,
    context?: string
  ) => {
    if (!repository) {
      toast.error('No repository selected');
      return;
    }

    setLoading(true);
    try {
      const task = await GitOpsAgentService.createPRAutonomous(
        repository.id,
        sourceBranch,
        targetBranch,
        context
      );
      setTasks(prev => [...prev, task]);
      toast.success('Pull request creation initiated');
      return task;
    } catch (error) {
      console.error('Error creating PR:', error);
      toast.error('Failed to create pull request');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const analyzeConflicts = useCallback(async (sourceBranch: string, targetBranch: string) => {
    if (!repository) {
      toast.error('No repository selected');
      return;
    }

    setLoading(true);
    try {
      const analysis = await GitOpsAgentService.analyzeConflicts(
        repository.id,
        sourceBranch,
        targetBranch
      );
      
      if (analysis.hasConflicts) {
        toast.warning(`Found conflicts in ${analysis.conflictingFiles.length} files`);
      } else {
        toast.success('No conflicts detected');
      }
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing conflicts:', error);
      toast.error('Failed to analyze conflicts');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const resolveConflict = useCallback(async (
    conflictPath: string,
    strategy: 'ours' | 'theirs' | 'ai_merge'
  ) => {
    if (!repository) {
      toast.error('No repository selected');
      return;
    }

    setLoading(true);
    try {
      const task = await GitOpsAgentService.resolveConflictAutonomous(
        repository.id,
        conflictPath,
        strategy
      );
      setTasks(prev => [...prev, task]);
      toast.success('Conflict resolution initiated');
      return task;
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast.error('Failed to resolve conflict');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const reviewPullRequest = useCallback(async (prNumber: number) => {
    if (!repository) {
      toast.error('No repository selected');
      return;
    }

    setLoading(true);
    try {
      const review = await GitOpsAgentService.reviewPRAutonomous(repository.id, prNumber);
      
      if (review.approved) {
        toast.success('PR review completed - Approved');
      } else {
        toast.warning('PR review completed - Changes requested');
      }
      
      return review;
    } catch (error) {
      console.error('Error reviewing PR:', error);
      toast.error('Failed to review pull request');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const mergePullRequest = useCallback(async (
    prNumber: number,
    mergeStrategy: 'merge' | 'squash' | 'rebase' = 'merge'
  ) => {
    if (!repository) {
      toast.error('No repository selected');
      return;
    }

    setLoading(true);
    try {
      const task = await GitOpsAgentService.mergePRAutonomous(
        repository.id,
        prNumber,
        mergeStrategy
      );
      setTasks(prev => [...prev, task]);
      toast.success('PR merge initiated');
      return task;
    } catch (error) {
      console.error('Error merging PR:', error);
      toast.error('Failed to merge pull request');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const monitorPipeline = useCallback(async (branchName: string) => {
    if (!repository) {
      toast.error('No repository selected');
      return;
    }

    try {
      const status = await GitOpsAgentService.monitorPipeline(repository.id, branchName);
      return status;
    } catch (error) {
      console.error('Error monitoring pipeline:', error);
      toast.error('Failed to monitor pipeline');
    }
  }, [repository]);

  const triggerDeployment = useCallback(async (
    environment: 'staging' | 'production',
    branch: string
  ) => {
    if (!repository) {
      toast.error('No repository selected');
      return;
    }

    setLoading(true);
    try {
      const task = await GitOpsAgentService.triggerDeployment(
        repository.id,
        environment,
        branch
      );
      setTasks(prev => [...prev, task]);
      toast.success(`Deployment to ${environment} initiated`);
      return task;
    } catch (error) {
      console.error('Error triggering deployment:', error);
      toast.error('Failed to trigger deployment');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const generateChangelog = useCallback(async (fromTag?: string, toTag?: string) => {
    if (!repository) {
      toast.error('No repository selected');
      return;
    }

    setLoading(true);
    try {
      const changelog = await GitOpsAgentService.generateChangelog(
        repository.id,
        fromTag,
        toTag
      );
      toast.success('Changelog generated');
      return changelog;
    } catch (error) {
      console.error('Error generating changelog:', error);
      toast.error('Failed to generate changelog');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const loadTasks = useCallback(async () => {
    if (!repository) return;

    setLoading(true);
    try {
      const taskList = await GitOpsAgentService.listTasks(repository.id);
      setTasks(taskList);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  return {
    workflows,
    tasks,
    loading,
    activeWorkflow,
    setActiveWorkflow,
    createWorkflow,
    createBranch,
    createPullRequest,
    analyzeConflicts,
    resolveConflict,
    reviewPullRequest,
    mergePullRequest,
    monitorPipeline,
    triggerDeployment,
    generateChangelog,
    loadTasks
  };
}
