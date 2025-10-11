export type DeduplicationLevel = 'execution' | 'input' | 'workflow';
export type CompareMethod = 'all_fields' | 'specific_fields' | 'hash' | 'custom_function';
export type KeepStrategy = 'first' | 'last' | 'newest' | 'oldest';

export interface SmartDetectionConfig {
  fuzzy_matching: boolean;
  similarity_threshold: number;
  ignore_case: boolean;
  normalize_whitespace: boolean;
}

export interface ErrorHandlingConfig {
  on_missing_fields: 'skip' | 'error' | 'use_default';
  on_processing_error: 'stop' | 'continue' | 'log';
  validation_rules: 'strict' | 'lenient';
}

export interface RemoveDuplicatesConfig {
  deduplication_level: DeduplicationLevel;
  compare_method: CompareMethod;
  fields?: string[];
  keep: KeepStrategy;
  custom_function?: string;
  smart_detection?: SmartDetectionConfig;
  batch_size?: number;
  stream_processing?: boolean;
  output_duplicates?: boolean;
  statistics?: boolean;
  error_handling?: ErrorHandlingConfig;
}

export interface DeduplicationStatistics {
  total_items: number;
  unique_items: number;
  duplicates_removed: number;
  processing_time_ms: number;
  memory_usage_mb?: number;
}

export interface RemoveDuplicatesResult {
  unique_items: any[];
  duplicates?: any[];
  statistics: DeduplicationStatistics;
}

export const DEFAULT_REMOVE_DUPLICATES_CONFIG: RemoveDuplicatesConfig = {
  deduplication_level: 'execution',
  compare_method: 'all_fields',
  keep: 'first',
  smart_detection: {
    fuzzy_matching: false,
    similarity_threshold: 0.85,
    ignore_case: true,
    normalize_whitespace: true
  },
  batch_size: 1000,
  stream_processing: true,
  output_duplicates: false,
  statistics: true,
  error_handling: {
    on_missing_fields: 'skip',
    on_processing_error: 'continue',
    validation_rules: 'lenient'
  }
};
