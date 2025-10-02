import { useState, useCallback, useEffect } from 'react';
import { DeploymentReadinessService } from '@/services/deployment/readinessService';
import type {
  DeploymentIssue,
  SecurityScan,
  InfrastructureValidation,
  StakeholderReview,
  DeploymentPhase,
  GoNoGoDecision
} from '@/services/deployment/readinessService';
import { toast } from 'sonner';

export function useDeploymentReadiness() {
  const [issues, setIssues] = useState<DeploymentIssue[]>([]);
  const [securityScans, setSecurityScans] = useState<SecurityScan[]>([]);
  const [infrastructureValidations, setInfrastructureValidations] = useState<InfrastructureValidation[]>([]);
  const [stakeholderReviews, setStakeholderReviews] = useState<StakeholderReview[]>([]);
  const [phases, setPhases] = useState<DeploymentPhase[]>([]);
  const [goNoGoDecision, setGoNoGoDecision] = useState<GoNoGoDecision | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadIssues = useCallback(async (phase?: number) => {
    try {
      const data = await DeploymentReadinessService.getDeploymentIssues(phase);
      setIssues(data);
    } catch (error) {
      console.error('Error loading issues:', error);
    }
  }, []);

  const generateIssues = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DeploymentReadinessService.generateDeploymentIssues();
      setIssues(data);
      toast.success(`Generated ${data.length} deployment readiness issues`);
    } catch (error) {
      console.error('Error generating issues:', error);
      toast.error('Failed to generate issues');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIssueStatus = useCallback(async (issueId: string, status: DeploymentIssue['status']) => {
    try {
      await DeploymentReadinessService.updateIssueStatus(issueId, status);
      await loadIssues();
      toast.success('Issue status updated');
    } catch (error) {
      console.error('Error updating issue:', error);
      toast.error('Failed to update issue status');
    }
  }, [loadIssues]);

  const runSecurityScan = useCallback(async (scanType: SecurityScan['type']) => {
    setLoading(true);
    try {
      const scan = await DeploymentReadinessService.runSecurityScan(scanType);
      setSecurityScans(prev => [...prev, scan]);
      toast.success(`${scanType} security scan completed`);
      return scan;
    } catch (error) {
      console.error('Error running security scan:', error);
      toast.error(`Failed to run ${scanType} scan`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSecurityScans = useCallback(async () => {
    try {
      const data = await DeploymentReadinessService.getSecurityScans();
      setSecurityScans(data);
    } catch (error) {
      console.error('Error loading security scans:', error);
    }
  }, []);

  const validateInfrastructure = useCallback(async (platform: InfrastructureValidation['platform']) => {
    setLoading(true);
    try {
      const validation = await DeploymentReadinessService.validateInfrastructure(platform);
      setInfrastructureValidations(prev => [...prev, validation]);
      toast.success(`${platform.toUpperCase()} infrastructure validation completed`);
      return validation;
    } catch (error) {
      console.error('Error validating infrastructure:', error);
      toast.error(`Failed to validate ${platform} infrastructure`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInfrastructureValidations = useCallback(async () => {
    try {
      const data = await DeploymentReadinessService.getInfrastructureValidations();
      setInfrastructureValidations(data);
    } catch (error) {
      console.error('Error loading infrastructure validations:', error);
    }
  }, []);

  const submitForReview = useCallback(async (
    stakeholderGroup: StakeholderReview['stakeholderGroup'],
    reviewers: string[]
  ) => {
    setLoading(true);
    try {
      const review = await DeploymentReadinessService.submitForReview(stakeholderGroup, reviewers);
      setStakeholderReviews(prev => [...prev, review]);
      toast.success(`Submitted for ${stakeholderGroup} review`);
      return review;
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast.error('Failed to submit for review');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStakeholderReviews = useCallback(async () => {
    try {
      const data = await DeploymentReadinessService.getStakeholderReviews();
      setStakeholderReviews(data);
    } catch (error) {
      console.error('Error loading stakeholder reviews:', error);
    }
  }, []);

  const loadPhases = useCallback(async () => {
    try {
      const data = await DeploymentReadinessService.getDeploymentPhases();
      setPhases(data);
    } catch (error) {
      console.error('Error loading phases:', error);
    }
  }, []);

  const updatePhaseStatus = useCallback(async (phase: number, status: DeploymentPhase['status']) => {
    try {
      await DeploymentReadinessService.updatePhaseStatus(phase, status);
      await loadPhases();
      toast.success(`Phase ${phase} status updated`);
    } catch (error) {
      console.error('Error updating phase:', error);
      toast.error('Failed to update phase status');
    }
  }, [loadPhases]);

  const loadGoNoGoDecision = useCallback(async () => {
    try {
      const data = await DeploymentReadinessService.getLatestGoNoGoDecision();
      setGoNoGoDecision(data);
    } catch (error) {
      console.error('Error loading go/no-go decision:', error);
    }
  }, []);

  const loadMetrics = useCallback(async () => {
    try {
      const data = await DeploymentReadinessService.getDeploymentMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  }, []);

  const generateReport = useCallback(async () => {
    setLoading(true);
    try {
      const report = await DeploymentReadinessService.generateConsolidatedReport();
      toast.success('Consolidated report generated');
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadIssues();
    loadSecurityScans();
    loadInfrastructureValidations();
    loadStakeholderReviews();
    loadPhases();
    loadGoNoGoDecision();
    loadMetrics();
  }, [
    loadIssues,
    loadSecurityScans,
    loadInfrastructureValidations,
    loadStakeholderReviews,
    loadPhases,
    loadGoNoGoDecision,
    loadMetrics
  ]);

  return {
    issues,
    securityScans,
    infrastructureValidations,
    stakeholderReviews,
    phases,
    goNoGoDecision,
    metrics,
    loading,
    generateIssues,
    updateIssueStatus,
    runSecurityScan,
    validateInfrastructure,
    submitForReview,
    updatePhaseStatus,
    generateReport,
    loadIssues,
    loadSecurityScans,
    loadInfrastructureValidations,
    loadStakeholderReviews,
    loadPhases,
    loadMetrics
  };
}
