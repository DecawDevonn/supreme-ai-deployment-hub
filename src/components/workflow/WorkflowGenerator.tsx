import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Download, Eye, ChevronRight, Save, FileJson, FileCode, ThumbsUp, ThumbsDown, Network } from 'lucide-react';
import { workflowGeneratorService } from '@/services/workflow/workflowGeneratorService';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import WorkflowVisualization from './WorkflowVisualization';
import ExampleWorkflows from './ExampleWorkflows';
import GraphStudio from './GraphStudio';
import { Workflow } from '@/types/workflow';
import { n8nService } from '@/services/workflow/n8nService';
import * as yaml from 'js-yaml';

interface WorkflowGeneratorProps {
  onWorkflowSaved?: (workflow: Workflow) => void;
}

const WorkflowGenerator: React.FC<WorkflowGeneratorProps> = ({ onWorkflowSaved }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const examplePrompts = [
    'Automate lead scoring and email follow-up for sales',
    'Create a content moderation pipeline with AI',
    'Build a deployment workflow for Kubernetes',
    'Generate social media posts from blog articles',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a workflow description');
      return;
    }

    setIsGenerating(true);
    setCurrentStage('Analyzing your request...');
    setResult(null);

    try {
      logger.info('Starting workflow generation', { prompt });

      // Stage 1: Classification
      setCurrentStage('Stage 1: Classifying workflow domain...');
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay for UX

      // Stage 2: Generation
      setCurrentStage('Stage 2: Generating workflow structure...');
      const generatedWorkflow = await workflowGeneratorService.generateWorkflow({ prompt });

      setResult(generatedWorkflow);
      setCurrentStage(null);
      toast.success('Workflow generated successfully!');
      logger.info('Workflow generated', { domain: generatedWorkflow.domain });
    } catch (error) {
      logger.error('Failed to generate workflow', { error });
      toast.error(error instanceof Error ? error.message : 'Failed to generate workflow');
      setCurrentStage(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadJSON = () => {
    if (!result) return;

    const blob = new Blob([JSON.stringify(result.workflow, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${result.domain}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Workflow JSON downloaded');
  };

  const handleDownloadYAML = () => {
    if (!result) return;

    try {
      const yamlContent = yaml.dump(result.workflow);
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflow-${result.domain}-${Date.now()}.yaml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Workflow YAML downloaded');
    } catch (error) {
      logger.error('Failed to convert to YAML', { error });
      toast.error('Failed to generate YAML');
    }
  };

  const handleSaveToWorkflows = async () => {
    if (!result) return;

    try {
      const newWorkflow: Workflow = {
        id: '',
        name: result.workflow.name || `${result.domain} Workflow`,
        description: `Generated from: ${prompt.substring(0, 100)}...`,
        active: false,
        nodes: result.workflow.nodes || [],
        connections: result.workflow.connections || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: result.domain as any,
        tags: [result.domain, 'ai-generated'],
      };

      const savedWorkflow = await n8nService.createWorkflow(newWorkflow);
      toast.success('Workflow saved to My Workflows');
      logger.info('Workflow saved', { workflowId: savedWorkflow.id });
      
      if (onWorkflowSaved) {
        onWorkflowSaved(savedWorkflow);
      }
    } catch (error) {
      logger.error('Failed to save workflow', { error });
      toast.error('Failed to save workflow');
    }
  };

  const handleFeedback = (isPositive: boolean) => {
    setFeedback(isPositive ? 'positive' : 'negative');
    toast.success('Thank you for your feedback!');
    logger.info('User feedback recorded', { 
      isPositive, 
      domain: result?.domain,
      prompt: prompt.substring(0, 100)
    });
  };

  const handleSelectExample = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    toast.success('Example prompt loaded');
  };

  return (
    <Tabs defaultValue="generator" className="space-y-6">
      <TabsList>
        <TabsTrigger value="generator">
          <Sparkles className="h-4 w-4 mr-2" />
          Generator
        </TabsTrigger>
        <TabsTrigger value="graph">
          <Network className="h-4 w-4 mr-2" />
          Agent Graph
        </TabsTrigger>
        <TabsTrigger value="examples">
          <Eye className="h-4 w-4 mr-2" />
          Examples
        </TabsTrigger>
      </TabsList>

      <TabsContent value="generator" className="space-y-6">
        <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Workflow Generator</CardTitle>
          </div>
          <CardDescription>
            Describe your workflow in plain English, and our AI will generate a complete n8n workflow JSON
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">What workflow do you want to create?</label>
            <Textarea
              placeholder="Example: Automate lead scoring and send personalized emails based on user behavior"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isGenerating}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Example prompts:</label>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => !isGenerating && setPrompt(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {currentStage || 'Generating...'}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Workflow
              </>
            )}
          </Button>

          {isGenerating && (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="font-medium">Stage 1:</span>
                      <span className="text-muted-foreground">Template Selection</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                      <span className="font-medium">Stage 2:</span>
                      <span className="text-muted-foreground">JSON Generation</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          <WorkflowVisualization workflow={result.workflow} />
          
          <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Generated Workflow</CardTitle>
                <CardDescription>
                  Domain: <Badge variant="secondary">{result.domain}</Badge>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveToWorkflows}>
                  <Save className="mr-2 h-4 w-4" />
                  Save to My Workflows
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
                  <FileJson className="mr-2 h-4 w-4" />
                  JSON
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadYAML}>
                  <FileCode className="mr-2 h-4 w-4" />
                  YAML
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Workflow Details</span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <span>Nodes: {result.workflow.nodes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <span>Connections: {Object.keys(result.workflow.connections || {}).length}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Workflow JSON Preview</label>
              <div className="rounded-lg bg-muted p-4 max-h-96 overflow-auto">
                <pre className="text-xs">
                  {JSON.stringify(result.workflow, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Was this workflow helpful?</h4>
                <p className="text-xs text-muted-foreground">Your feedback helps us improve</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={feedback === 'positive' ? 'default' : 'outline'}
                  onClick={() => handleFeedback(true)}
                  disabled={feedback !== null}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={feedback === 'negative' ? 'destructive' : 'outline'}
                  onClick={() => handleFeedback(false)}
                  disabled={feedback !== null}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Next Steps</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Click "Save to My Workflows" to add it to your collection</li>
                    <li>Or download as JSON/YAML to import into n8n</li>
                    <li>Configure any required credentials</li>
                    <li>Test and activate your workflow</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        </>
      )}
            </TabsContent>

            <TabsContent value="graph">
              {result?.graph ? (
                <GraphStudio graph={result.graph} />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Network className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Generate a workflow to see its multi-agent graph
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="examples">
              <ExampleWorkflows onSelectExample={handleSelectExample} />
            </TabsContent>
          </Tabs>
  );
};

export default WorkflowGenerator;
