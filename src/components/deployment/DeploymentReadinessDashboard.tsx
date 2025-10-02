import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDeploymentReadiness } from '@/hooks/useDeploymentReadiness';
import {
  Shield,
  Server,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  FileText,
  Play,
  RefreshCw,
  Loader2,
  CheckCheck,
  XCircle
} from 'lucide-react';

const DeploymentReadinessDashboard = () => {
  const {
    issues,
    securityScans,
    infrastructureValidations,
    stakeholderReviews,
    phases,
    goNoGoDecision,
    metrics,
    loading,
    generateIssues,
    runSecurityScan,
    validateInfrastructure,
    submitForReview,
    updatePhaseStatus,
    generateReport
  } = useDeploymentReadiness();

  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'passed':
      case 'approved':
        return 'text-green-500 bg-green-500/10';
      case 'in_progress':
      case 'in_review':
      case 'validating':
        return 'text-blue-500 bg-blue-500/10';
      case 'failed':
      case 'rejected':
      case 'blocked':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-500 bg-red-500/10';
      case 'high':
        return 'text-orange-500 bg-orange-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      default:
        return 'text-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Supreme AI Deployment Hub</h1>
          <p className="text-muted-foreground">
            Production readiness dashboard with automated workflows and stakeholder management
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateReport} variant="outline" disabled={loading}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button onClick={generateIssues} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Generate Issues
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Issue Completion</p>
                  <p className="text-2xl font-bold">
                    {Math.round((metrics.completedIssues / metrics.totalIssues) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.completedIssues}/{metrics.totalIssues} completed
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <Progress 
                value={(metrics.completedIssues / metrics.totalIssues) * 100} 
                className="mt-4"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Score</p>
                  <p className="text-2xl font-bold">{metrics.securityScore}/100</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.securityScore >= 90 ? 'Excellent' : 'Needs improvement'}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
              <Progress value={metrics.securityScore} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Infrastructure Health</p>
                  <p className="text-2xl font-bold">{metrics.infrastructureHealth}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All platforms validated
                  </p>
                </div>
                <Server className="h-8 w-8 text-purple-500" />
              </div>
              <Progress value={metrics.infrastructureHealth} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stakeholder Approval</p>
                  <p className="text-2xl font-bold">{metrics.stakeholderApprovalRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stakeholderReviews.filter(r => r.status === 'approved').length} groups approved
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <Progress value={metrics.stakeholderApprovalRate} className="mt-4" />
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="go-nogo">Go/No-Go</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Issues</CardTitle>
                <CardDescription>Latest deployment readiness items</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {issues.slice(0, 10).map((issue) => (
                      <div key={issue.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getPriorityColor(issue.priority)}>
                              {issue.priority}
                            </Badge>
                            <Badge variant="outline">Phase {issue.phase}</Badge>
                          </div>
                          <p className="font-medium truncate">{issue.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {issue.category}
                          </p>
                        </div>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phase Progress</CardTitle>
                <CardDescription>4-phase implementation timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phases.map((phase) => (
                    <div key={phase.phase} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Phase {phase.phase}: {phase.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {phase.issues.length} issues, {phase.prNumbers.length} PRs
                          </p>
                        </div>
                        <Badge className={getStatusColor(phase.status)}>
                          {phase.status}
                        </Badge>
                      </div>
                      <Progress 
                        value={
                          (phase.issues.filter(i => i.status === 'completed').length / phase.issues.length) * 100
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Phases Tab */}
        <TabsContent value="phases" className="space-y-4">
          {phases.map((phase) => (
            <Card key={phase.phase}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Phase {phase.phase}: {phase.name}</CardTitle>
                    <CardDescription>{phase.description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(phase.status)}>
                    {phase.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Issues</p>
                      <p className="text-2xl font-bold">{phase.issues.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pull Requests</p>
                      <p className="text-2xl font-bold">{phase.prNumbers.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completion</p>
                      <p className="text-2xl font-bold">
                        {Math.round((phase.issues.filter(i => i.status === 'completed').length / phase.issues.length) * 100)}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Issues</h4>
                    <div className="space-y-2">
                      {phase.issues.map((issue) => (
                        <div key={issue.id} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{issue.title}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(issue.priority)} variant="outline">
                              {issue.priority}
                            </Badge>
                            <Badge className={getStatusColor(issue.status)}>
                              {issue.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Scanning
              </CardTitle>
              <CardDescription>
                Run comprehensive security scans across dependencies, code, containers, secrets, and infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-5 gap-2">
                <Button 
                  onClick={() => runSecurityScan('dependencies')}
                  variant="outline"
                  disabled={loading}
                >
                  Dependencies
                </Button>
                <Button 
                  onClick={() => runSecurityScan('code')}
                  variant="outline"
                  disabled={loading}
                >
                  Code
                </Button>
                <Button 
                  onClick={() => runSecurityScan('container')}
                  variant="outline"
                  disabled={loading}
                >
                  Containers
                </Button>
                <Button 
                  onClick={() => runSecurityScan('secrets')}
                  variant="outline"
                  disabled={loading}
                >
                  Secrets
                </Button>
                <Button 
                  onClick={() => runSecurityScan('infrastructure')}
                  variant="outline"
                  disabled={loading}
                >
                  Infrastructure
                </Button>
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {securityScans.map((scan) => (
                    <Card key={scan.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{scan.type}</Badge>
                            <Badge className={getStatusColor(scan.status)}>
                              {scan.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(scan.scanDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-500">
                              {scan.vulnerabilities.critical}
                            </p>
                            <p className="text-xs text-muted-foreground">Critical</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-500">
                              {scan.vulnerabilities.high}
                            </p>
                            <p className="text-xs text-muted-foreground">High</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-500">
                              {scan.vulnerabilities.medium}
                            </p>
                            <p className="text-xs text-muted-foreground">Medium</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-500">
                              {scan.vulnerabilities.low}
                            </p>
                            <p className="text-xs text-muted-foreground">Low</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Infrastructure Tab */}
        <TabsContent value="infrastructure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Infrastructure Validation
              </CardTitle>
              <CardDescription>
                Validate infrastructure across AWS, Azure, GCP, Vercel, and Netlify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-5 gap-2">
                {['aws', 'azure', 'gcp', 'vercel', 'netlify'].map((platform) => (
                  <Button
                    key={platform}
                    onClick={() => validateInfrastructure(platform as any)}
                    variant="outline"
                    disabled={loading}
                  >
                    {platform.toUpperCase()}
                  </Button>
                ))}
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {infrastructureValidations.map((validation) => (
                    <Card key={validation.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline">{validation.platform.toUpperCase()}</Badge>
                          <Badge className={getStatusColor(validation.status)}>
                            {validation.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {validation.checks.map((check, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 border rounded text-sm">
                              <span>{check.name}</span>
                              {check.status === 'pass' ? (
                                <CheckCheck className="h-4 w-4 text-green-500" />
                              ) : check.status === 'fail' ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stakeholders Tab */}
        <TabsContent value="stakeholders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Stakeholder Reviews
              </CardTitle>
              <CardDescription>
                Submit for review and track approval status across stakeholder groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {stakeholderReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{review.stakeholderGroup}</Badge>
                          <Badge className={getStatusColor(review.status)}>
                            {review.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Reviewers: {review.reviewers.join(', ')}
                        </p>
                        {review.approvalDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Approved: {new Date(review.approvalDate).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Go/No-Go Tab */}
        <TabsContent value="go-nogo" className="space-y-4">
          {goNoGoDecision && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Go/No-Go Decision
                </CardTitle>
                <CardDescription>
                  Latest deployment readiness decision
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center p-6">
                  <Badge 
                    className={`text-2xl px-6 py-3 ${
                      goNoGoDecision.decision === 'go' 
                        ? 'bg-green-500/10 text-green-500' 
                        : goNoGoDecision.decision === 'no-go'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}
                  >
                    {goNoGoDecision.decision.toUpperCase()}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Decision Criteria</h4>
                  <div className="space-y-2">
                    {goNoGoDecision.criteria.map((criteria, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{criteria.name}</span>
                        <div className="flex items-center gap-2">
                          {criteria.required && <Badge variant="outline">Required</Badge>}
                          {criteria.met ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeploymentReadinessDashboard;
