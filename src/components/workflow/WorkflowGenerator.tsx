import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Download, Eye, ChevronRight } from 'lucide-react';
import { workflowGeneratorService } from '@/services/workflow/workflowGeneratorService';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

const WorkflowGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

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

  const handleDownload = () => {
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

    toast.success('Workflow downloaded');
  };

  return (
    <div className="space-y-6">
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
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download JSON
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

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Next Steps</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Download the generated workflow JSON</li>
                    <li>Open your n8n instance</li>
                    <li>Import the JSON file into n8n</li>
                    <li>Configure any required credentials</li>
                    <li>Test and activate your workflow</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowGenerator;
