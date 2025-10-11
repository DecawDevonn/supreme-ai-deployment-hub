import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Zap, Mail, Image, FileText, Database } from 'lucide-react';

interface ExampleWorkflow {
  title: string;
  description: string;
  domain: string;
  prompt: string;
  icon: React.ReactNode;
  tags: string[];
}

const exampleWorkflows: ExampleWorkflow[] = [
  {
    title: 'Lead Scoring & Email Automation',
    description: 'Automatically score leads based on behavior and send personalized follow-up emails',
    domain: 'sales',
    prompt: 'Create a workflow that scores leads based on website activity and sends personalized emails to high-value prospects',
    icon: <Mail className="h-5 w-5" />,
    tags: ['Sales', 'CRM', 'Email'],
  },
  {
    title: 'AI Content Moderation',
    description: 'Use AI to moderate user-generated content and flag inappropriate posts',
    domain: 'creative',
    prompt: 'Build a content moderation pipeline that uses AI to analyze user posts for inappropriate content and automatically flags violations',
    icon: <Image className="h-5 w-5" />,
    tags: ['AI', 'Moderation', 'Safety'],
  },
  {
    title: 'Social Media Analytics Dashboard',
    description: 'Aggregate social media metrics and generate weekly performance reports',
    domain: 'analytics',
    prompt: 'Create a workflow that collects social media metrics from multiple platforms and generates a weekly analytics report',
    icon: <TrendingUp className="h-5 w-5" />,
    tags: ['Analytics', 'Reporting', 'Social'],
  },
  {
    title: 'Kubernetes Deployment Pipeline',
    description: 'Automated CI/CD pipeline for containerized applications',
    domain: 'deployment',
    prompt: 'Build a deployment workflow that builds Docker images, runs tests, and deploys to Kubernetes with rollback capabilities',
    icon: <Zap className="h-5 w-5" />,
    tags: ['DevOps', 'K8s', 'CI/CD'],
  },
  {
    title: 'Document Processing & OCR',
    description: 'Extract text from documents and store structured data',
    domain: 'productivity',
    prompt: 'Create a workflow that processes uploaded documents, extracts text using OCR, and stores the structured data in a database',
    icon: <FileText className="h-5 w-5" />,
    tags: ['OCR', 'Documents', 'Automation'],
  },
  {
    title: 'Data Sync Across Platforms',
    description: 'Keep data synchronized between multiple systems in real-time',
    domain: 'integration',
    prompt: 'Build a workflow that syncs customer data between CRM, email marketing platform, and analytics tools in real-time',
    icon: <Database className="h-5 w-5" />,
    tags: ['Integration', 'Sync', 'CRM'],
  },
];

interface ExampleWorkflowsProps {
  onSelectExample: (prompt: string) => void;
}

const ExampleWorkflows: React.FC<ExampleWorkflowsProps> = ({ onSelectExample }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Example Workflows</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Get started with these proven workflow examples. Click any example to use its prompt.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exampleWorkflows.map((example, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {example.icon}
                  <Badge variant="secondary" className="text-xs">
                    {example.domain}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-base mt-2">{example.title}</CardTitle>
              <CardDescription className="text-xs">{example.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {example.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                size="sm"
                variant="default"
                className="w-full"
                onClick={() => onSelectExample(example.prompt)}
              >
                Use This Example
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExampleWorkflows;
