import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGitOpsAgent } from '@/hooks/agents/useGitOpsAgent';
import { GitRepository } from '@/services/git';
import { 
  GitBranch, 
  GitPullRequest, 
  GitMerge, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Rocket,
  FileText,
  PlayCircle,
  Loader2
} from 'lucide-react';

interface GitOpsAgentProps {
  repository: GitRepository;
}

const GitOpsAgent: React.FC<GitOpsAgentProps> = ({ repository }) => {
  const {
    workflows,
    tasks,
    loading,
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
  } = useGitOpsAgent(repository);

  const [branchDescription, setBranchDescription] = useState('');
  const [sourceBranch, setSourceBranch] = useState('');
  const [targetBranch, setTargetBranch] = useState('main');
  const [prContext, setPrContext] = useState('');
  const [prNumber, setPrNumber] = useState('');

  const handleCreateBranch = async () => {
    if (!branchDescription) return;
    await createBranch(branchDescription, targetBranch);
    setBranchDescription('');
  };

  const handleCreatePR = async () => {
    if (!sourceBranch || !targetBranch) return;
    await createPullRequest(sourceBranch, targetBranch, prContext);
    setSourceBranch('');
    setPrContext('');
  };

  const handleAnalyzeConflicts = async () => {
    if (!sourceBranch || !targetBranch) return;
    await analyzeConflicts(sourceBranch, targetBranch);
  };

  const handleReviewPR = async () => {
    const num = parseInt(prNumber);
    if (isNaN(num)) return;
    await reviewPullRequest(num);
  };

  const handleMergePR = async () => {
    const num = parseInt(prNumber);
    if (isNaN(num)) return;
    await mergePullRequest(num, 'merge');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          GitOps Autonomous Agent
        </CardTitle>
        <CardDescription>
          Automate Git workflows with AI-powered branch management, PR handling, and deployments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="operations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-6">
            {/* Branch Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Create Branch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="branch-desc">Task Description</Label>
                  <Input
                    id="branch-desc"
                    placeholder="e.g., Add user authentication feature"
                    value={branchDescription}
                    onChange={(e) => setBranchDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base-branch">Base Branch</Label>
                  <Input
                    id="base-branch"
                    placeholder="main"
                    value={targetBranch}
                    onChange={(e) => setTargetBranch(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCreateBranch} 
                  disabled={loading || !branchDescription}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <GitBranch className="h-4 w-4 mr-2" />}
                  Create Branch Autonomously
                </Button>
              </CardContent>
            </Card>

            {/* Pull Request Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4" />
                  Create Pull Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-branch">Source Branch</Label>
                    <Input
                      id="source-branch"
                      placeholder="feature/new-auth"
                      value={sourceBranch}
                      onChange={(e) => setSourceBranch(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-branch-pr">Target Branch</Label>
                    <Input
                      id="target-branch-pr"
                      placeholder="main"
                      value={targetBranch}
                      onChange={(e) => setTargetBranch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pr-context">Context (Optional)</Label>
                  <Input
                    id="pr-context"
                    placeholder="Additional context for PR description"
                    value={prContext}
                    onChange={(e) => setPrContext(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreatePR} 
                    disabled={loading || !sourceBranch}
                    className="flex-1"
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <GitPullRequest className="h-4 w-4 mr-2" />}
                    Create PR
                  </Button>
                  <Button 
                    onClick={handleAnalyzeConflicts} 
                    disabled={loading || !sourceBranch}
                    variant="outline"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Check Conflicts
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PR Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GitMerge className="h-4 w-4" />
                  Manage Pull Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pr-number">PR Number</Label>
                  <Input
                    id="pr-number"
                    type="number"
                    placeholder="42"
                    value={prNumber}
                    onChange={(e) => setPrNumber(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleReviewPR} 
                    disabled={loading || !prNumber}
                    variant="outline"
                    className="flex-1"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Review PR
                  </Button>
                  <Button 
                    onClick={handleMergePR} 
                    disabled={loading || !prNumber}
                    className="flex-1"
                  >
                    <GitMerge className="h-4 w-4 mr-2" />
                    Merge PR
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Deployment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  Deployment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => triggerDeployment('staging', repository.branch)}
                    disabled={loading}
                    variant="outline"
                    className="flex-1"
                  >
                    Deploy to Staging
                  </Button>
                  <Button 
                    onClick={() => triggerDeployment('production', repository.branch)}
                    disabled={loading}
                    className="flex-1"
                  >
                    Deploy to Production
                  </Button>
                </div>
                <Button 
                  onClick={() => generateChangelog()}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Changelog
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <PlayCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No tasks yet</p>
                    <p className="text-sm">Start by creating a branch or pull request</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getStatusIcon(task.status)}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{task.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(task.createdAt).toLocaleString()}
                              </p>
                              {task.error && (
                                <p className="text-sm text-red-500 mt-1">{task.error}</p>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="workflows">
            <div className="text-center py-8 text-muted-foreground">
              <p>Workflow automation coming soon</p>
              <p className="text-sm">Create custom automation rules for your Git operations</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GitOpsAgent;
