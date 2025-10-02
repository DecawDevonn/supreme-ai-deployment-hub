import { apiClient, handleServiceError } from '../config';

export interface DeploymentIssue {
  id: string;
  number: number;
  title: string;
  description: string;
  phase: 1 | 2 | 3 | 4;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'security' | 'infrastructure' | 'testing' | 'operational' | 'documentation';
  status: 'open' | 'in_progress' | 'review' | 'completed' | 'blocked';
  assignees: string[];
  labels: string[];
  prNumbers?: number[];
  dependencies?: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface SecurityScan {
  id: string;
  type: 'dependencies' | 'code' | 'container' | 'secrets' | 'infrastructure';
  status: 'pending' | 'running' | 'completed' | 'failed';
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  findings: SecurityFinding[];
  scanDate: Date;
}

export interface SecurityFinding {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  package?: string;
  file?: string;
  line?: number;
  remediation: string;
  cve?: string;
}

export interface InfrastructureValidation {
  id: string;
  platform: 'aws' | 'azure' | 'gcp' | 'vercel' | 'netlify';
  status: 'pending' | 'validating' | 'passed' | 'failed';
  checks: InfrastructureCheck[];
  timestamp: Date;
}

export interface InfrastructureCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export interface StakeholderReview {
  id: string;
  stakeholderGroup: 'technical' | 'business' | 'compliance' | 'security' | 'operations';
  reviewers: string[];
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'conditional';
  comments: ReviewComment[];
  approvalDate?: Date;
}

export interface ReviewComment {
  reviewer: string;
  comment: string;
  timestamp: Date;
  type: 'approval' | 'concern' | 'suggestion' | 'blocker';
}

export interface DeploymentPhase {
  phase: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  status: 'pending' | 'in_progress' | 'completed';
  issues: DeploymentIssue[];
  prNumbers: number[];
  milestones: string[];
}

export interface GoNoGoDecision {
  id: string;
  timestamp: Date;
  decision: 'go' | 'no-go' | 'conditional' | 'pending';
  criteria: DecisionCriteria[];
  stakeholderVotes: StakeholderVote[];
  notes: string;
  nextReviewDate?: Date;
}

export interface DecisionCriteria {
  name: string;
  met: boolean;
  required: boolean;
  details: string;
}

export interface StakeholderVote {
  stakeholder: string;
  group: string;
  vote: 'go' | 'no-go' | 'abstain';
  comment: string;
}

export const DeploymentReadinessService = {
  // Issue Management
  generateDeploymentIssues: async (): Promise<DeploymentIssue[]> => {
    try {
      const response = await apiClient.post('/deployment/issues/generate');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error generating deployment issues');
    }
  },

  getDeploymentIssues: async (phase?: number): Promise<DeploymentIssue[]> => {
    try {
      const response = await apiClient.get('/deployment/issues', {
        params: { phase }
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching deployment issues');
    }
  },

  updateIssueStatus: async (issueId: string, status: DeploymentIssue['status']): Promise<void> => {
    try {
      await apiClient.patch(`/deployment/issues/${issueId}`, { status });
    } catch (error) {
      return handleServiceError(error, 'Error updating issue status');
    }
  },

  // Security Scanning
  runSecurityScan: async (scanType: SecurityScan['type']): Promise<SecurityScan> => {
    try {
      const response = await apiClient.post('/deployment/security/scan', { scanType });
      return response.data;
    } catch (error) {
      return handleServiceError(error, `Error running ${scanType} security scan`);
    }
  },

  getSecurityScans: async (): Promise<SecurityScan[]> => {
    try {
      const response = await apiClient.get('/deployment/security/scans');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching security scans');
    }
  },

  getSecuritySummary: async (): Promise<{
    totalVulnerabilities: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    lastScanDate: Date;
    complianceStatus: 'compliant' | 'non-compliant' | 'needs-review';
  }> => {
    try {
      const response = await apiClient.get('/deployment/security/summary');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching security summary');
    }
  },

  // Infrastructure Validation
  validateInfrastructure: async (platform: InfrastructureValidation['platform']): Promise<InfrastructureValidation> => {
    try {
      const response = await apiClient.post('/deployment/infrastructure/validate', { platform });
      return response.data;
    } catch (error) {
      return handleServiceError(error, `Error validating ${platform} infrastructure`);
    }
  },

  getInfrastructureValidations: async (): Promise<InfrastructureValidation[]> => {
    try {
      const response = await apiClient.get('/deployment/infrastructure/validations');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching infrastructure validations');
    }
  },

  // Stakeholder Management
  submitForReview: async (
    stakeholderGroup: StakeholderReview['stakeholderGroup'],
    reviewers: string[]
  ): Promise<StakeholderReview> => {
    try {
      const response = await apiClient.post('/deployment/stakeholders/review', {
        stakeholderGroup,
        reviewers
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error submitting for stakeholder review');
    }
  },

  getStakeholderReviews: async (): Promise<StakeholderReview[]> => {
    try {
      const response = await apiClient.get('/deployment/stakeholders/reviews');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching stakeholder reviews');
    }
  },

  addReviewComment: async (
    reviewId: string,
    comment: string,
    type: ReviewComment['type']
  ): Promise<void> => {
    try {
      await apiClient.post(`/deployment/stakeholders/reviews/${reviewId}/comments`, {
        comment,
        type
      });
    } catch (error) {
      return handleServiceError(error, 'Error adding review comment');
    }
  },

  // Phase Management
  getDeploymentPhases: async (): Promise<DeploymentPhase[]> => {
    try {
      const response = await apiClient.get('/deployment/phases');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching deployment phases');
    }
  },

  updatePhaseStatus: async (phase: number, status: DeploymentPhase['status']): Promise<void> => {
    try {
      await apiClient.patch(`/deployment/phases/${phase}`, { status });
    } catch (error) {
      return handleServiceError(error, 'Error updating phase status');
    }
  },

  // Go/No-Go Decision
  createGoNoGoDecision: async (
    criteria: DecisionCriteria[],
    stakeholderVotes: StakeholderVote[]
  ): Promise<GoNoGoDecision> => {
    try {
      const response = await apiClient.post('/deployment/go-no-go', {
        criteria,
        stakeholderVotes
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error creating go/no-go decision');
    }
  },

  getLatestGoNoGoDecision: async (): Promise<GoNoGoDecision> => {
    try {
      const response = await apiClient.get('/deployment/go-no-go/latest');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching go/no-go decision');
    }
  },

  // Metrics and Reporting
  getDeploymentMetrics: async (): Promise<{
    totalIssues: number;
    completedIssues: number;
    blockedIssues: number;
    securityScore: number;
    infrastructureHealth: number;
    stakeholderApprovalRate: number;
    estimatedDeploymentDate: Date;
  }> => {
    try {
      const response = await apiClient.get('/deployment/metrics');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error fetching deployment metrics');
    }
  },

  generateConsolidatedReport: async (): Promise<{
    summary: string;
    phases: DeploymentPhase[];
    security: SecurityScan[];
    infrastructure: InfrastructureValidation[];
    stakeholders: StakeholderReview[];
    goNoGo: GoNoGoDecision;
    recommendations: string[];
  }> => {
    try {
      const response = await apiClient.get('/deployment/reports/consolidated');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Error generating consolidated report');
    }
  },

  // PR Integration
  getPRsByPhase: async (phase: number): Promise<{
    prNumber: number;
    title: string;
    status: 'open' | 'merged' | 'closed';
    priority: string;
    relatedIssues: string[];
  }[]> => {
    try {
      const response = await apiClient.get(`/deployment/prs/phase/${phase}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, `Error fetching PRs for phase ${phase}`);
    }
  }
};
