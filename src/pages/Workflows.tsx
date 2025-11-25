import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Play, 
  Plus, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

const Workflows = () => {
  const [workflows] = useState([
    {
      id: 1,
      name: "Daily Market Analysis",
      status: "active",
      lastRun: "2 hours ago",
      triggers: ["Schedule: Daily 9 AM"],
      actions: ["Fetch market data", "Analyze trends", "Send report"]
    },
    {
      id: 2,
      name: "Content Automation",
      status: "paused",
      lastRun: "1 day ago",
      triggers: ["New article published"],
      actions: ["Generate social posts", "Schedule distribution", "Track engagement"]
    },
    {
      id: 3,
      name: "Lead Nurturing",
      status: "active",
      lastRun: "30 minutes ago",
      triggers: ["New lead captured"],
      actions: ["Send welcome email", "Add to CRM", "Schedule follow-up"]
    },
  ]);

  const templates = [
    "Social Media Automation",
    "Email Marketing Campaign",
    "Data Backup & Sync",
    "Customer Onboarding",
    "Report Generation",
    "Task Automation"
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "paused":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Workflows
          </h1>
          <p className="text-muted-foreground">
            Automate your tasks and processes
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {workflows.filter(w => w.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Runs Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">47</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">98.5%</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Workflows</h2>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GitBranch className="w-5 h-5 text-primary" />
                      <CardTitle>{workflow.name}</CardTitle>
                      {getStatusIcon(workflow.status)}
                    </div>
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      Run Now
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Last run: {workflow.lastRun}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Triggers:</p>
                      <div className="flex flex-wrap gap-2">
                        {workflow.triggers.map((trigger, i) => (
                          <Badge key={i} variant="secondary">{trigger}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Actions:</p>
                      <div className="flex flex-wrap gap-2">
                        {workflow.actions.map((action, i) => (
                          <Badge key={i} variant="outline">{action}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Workflow Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template, i) => (
              <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <p className="font-medium mb-2">{template}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workflows;
