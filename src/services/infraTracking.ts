import yaml from 'js-yaml';

export interface PipelineStatus {
  status: string;
  note: string;
  last_modified_by: string;
  branch: string;
  trigger?: string;
}

export interface BranchInfo {
  status: string;
  notes: string;
}

export interface InfraTrackingData {
  infra_tracking: {
    last_update: string;
    pipelines: Record<string, PipelineStatus>;
  };
  branches: Record<string, BranchInfo>;
  notifications: {
    slack_webhook: string;
    notify_on_change: boolean;
    notify_on_failure: boolean;
  };
}

/**
 * Fetches and parses the infrastructure tracking YAML file
 */
export const fetchInfraTracking = async (): Promise<InfraTrackingData | null> => {
  try {
    const response = await fetch('/devonn-infra-tracking.yml');
    if (!response.ok) {
      console.error('Failed to fetch infrastructure tracking data');
      return null;
    }
    
    const yamlText = await response.text();
    const data = yaml.load(yamlText) as InfraTrackingData;
    return data;
  } catch (error) {
    console.error('Error parsing infrastructure tracking data:', error);
    return null;
  }
};

/**
 * Gets the status color for a pipeline
 */
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'in_progress':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'stable':
    case 'success':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'disabled':
    case 'optional':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'error':
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

/**
 * Formats the last update timestamp
 */
export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  } catch (error) {
    return timestamp;
  }
};
