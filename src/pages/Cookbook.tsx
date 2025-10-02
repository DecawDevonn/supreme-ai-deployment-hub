import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code, Workflow, Cloud, GitBranch } from 'lucide-react';

const Cookbook = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="w-8 h-8" />
          Copilot Chat Cookbook for Devonn.ai
        </h1>
        <p className="text-muted-foreground">
          Structured best practices, recipes, and integration workflows for using Copilot Chat with GitHub, n8n, and cloud connectors.
        </p>
      </div>

      <Tabs defaultValue="principles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="principles">Principles</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="practices">Best Practices</TabsTrigger>
          <TabsTrigger value="extensions">Extensions</TabsTrigger>
        </TabsList>

        <TabsContent value="principles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Core Principles</CardTitle>
              <CardDescription>
                Foundational concepts for Devonn.ai Copilot Chat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <div className="w-2 h-2 mt-2 bg-primary rounded-full" />
                  <div>
                    <h4 className="font-semibold mb-1">Parallel Knowledge Graph Layer</h4>
                    <p className="text-sm text-muted-foreground">
                      Enrich all responses with Knowledge Graph updates. Every conversation automatically extracts entities and relationships.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <div className="w-2 h-2 mt-2 bg-primary rounded-full" />
                  <div>
                    <h4 className="font-semibold mb-1">Bridging Questions</h4>
                    <p className="text-sm text-muted-foreground">
                      Identify blind spots with clarifying questions. The AI proactively asks for missing context.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <div className="w-2 h-2 mt-2 bg-primary rounded-full" />
                  <div>
                    <h4 className="font-semibold mb-1">Meta-awareness</h4>
                    <p className="text-sm text-muted-foreground">
                      Track logs, state, and workflow provenance. Full conversation history with metadata tracking.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Environment Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    GitHub Integration
                  </h4>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Secrets:</strong> Add API keys in GitHub → Settings → Secrets</p>
                    <p className="text-sm"><strong>Actions:</strong> Connect pipelines to Devonn backend</p>
                    <p className="text-sm"><strong>n8n Workflow:</strong></p>
                    <pre className="text-xs bg-background p-2 rounded mt-2">
{`GitHub Trigger (push/issue)
   → Devonn API (KG update, CI/CD action)
   → Slack/Email Notification`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Cloud Backends</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Badge variant="outline">AWS EKS - Production K8s</Badge>
                    <Badge variant="outline">RunPod - GPU workloads</Badge>
                    <Badge variant="outline">Supabase - Auth + Vector DB</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Workflow Recipes
              </CardTitle>
              <CardDescription>
                Common patterns and implementations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">A. Knowledge Graph Updates</h4>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`workflow: KG_Update
trigger: chat_input
steps:
  - extract_entities: NLP entity recognition
  - update_neo4j: add nodes + relationships
  - respond_chat: enriched context`}
                  </pre>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Example:</strong> Chat: "Deploy service A to RunPod" → KG: <code>(:Service {`{name:"A"}`})-[:DEPLOYED_ON]→(:RunPod)</code>
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">B. GitHub Issue Bot</h4>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`workflow: Issue_Handler
trigger: github.issue.opened
steps:
  - parse_issue: categorize by label
  - suggest_fix: Copilot generates recommendation
  - notify_team: Slack webhook`}
                  </pre>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">C. Deployment Pipeline</h4>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`workflow: Deploy_Main
trigger: github.push.branch.main
steps:
  - build: docker build & push to registry
  - test: run pytest + jest
  - deploy: apply k8s manifests via ArgoCD`}
                  </pre>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">D. MCP Plugin Extension</h4>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`workflow: MCP_Plugin
trigger: chat_input.plugin
steps:
  - detect_plugin: NLP detects task type
  - load_plugin: dynamically load agent
  - execute: return structured output`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                  <Badge className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">Workflows modular</p>
                    <p className="text-sm text-muted-foreground">Easier to swap APIs/models</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                  <Badge className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">Appsmith dashboards</p>
                    <p className="text-sm text-muted-foreground">Monitor logs + Knowledge Graph</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                  <Badge className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">Fallbacks</p>
                    <p className="text-sm text-muted-foreground">Local Ollama/Whisper if APIs fail</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                  <Badge className="mt-1">4</Badge>
                  <div>
                    <p className="font-medium">Secure auth</p>
                    <p className="text-sm text-muted-foreground">Supabase + Auth0 OIDC</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extensions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5" />
                Advanced Extensions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">RunPod Connector</h4>
                  <p className="text-sm text-muted-foreground">GPU inference workloads</p>
                </div>

                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Nokia API / IoT Hooks</h4>
                  <p className="text-sm text-muted-foreground">Device event ingestion</p>
                </div>

                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Appsmith Dashboards</h4>
                  <p className="text-sm text-muted-foreground">Visualize CI/CD + KG</p>
                </div>

                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">MCP Agent Plugins</h4>
                  <p className="text-sm text-muted-foreground">PR review, testing, infra copilots</p>
                </div>

                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">LangGraph Orchestration</h4>
                  <p className="text-sm text-muted-foreground">Multi-agent reasoning</p>
                </div>

                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">AgenticSeek Integration</h4>
                  <p className="text-sm text-muted-foreground">HuggingFace Agents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Architecture Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-lg">
                <pre className="text-xs overflow-x-auto">
{`graph TD
    ChatInput -->|Entity Extraction| KG[Neo4j KG]
    KG -->|Update| DevonnAPI
    GitHub -->|Push/Issue| n8n --> CI[CI/CD Pipeline]
    CI --> ArgoCD --> AWS[EKS Cluster]
    DevonnAPI --> Appsmith[Dashboards]
    DevonnAPI --> RunPod[GPU Workloads]
    DevonnAPI --> MCP[Agent Plugins]`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cookbook;
