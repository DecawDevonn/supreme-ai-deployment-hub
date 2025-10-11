import {
  RemoveDuplicatesConfig,
  RemoveDuplicatesResult,
  DeduplicationStatistics
} from '@/types/nodes/removeDuplicates';
import { logger } from '@/lib/logger';

/**
 * Service for removing duplicates from datasets
 */
export class RemoveDuplicatesService {
  /**
   * Process items and remove duplicates based on configuration
   */
  async removeDuplicates(
    items: any[],
    config: RemoveDuplicatesConfig
  ): Promise<RemoveDuplicatesResult> {
    const startTime = Date.now();
    logger.info('Starting deduplication', { 
      itemCount: items.length, 
      config: config.compare_method 
    });

    try {
      // Process in batches if needed
      if (config.stream_processing && items.length > (config.batch_size || 1000)) {
        return await this.processBatches(items, config, startTime);
      }

      const { unique, duplicates } = await this.processItems(items, config);

      const statistics: DeduplicationStatistics = {
        total_items: items.length,
        unique_items: unique.length,
        duplicates_removed: duplicates.length,
        processing_time_ms: Date.now() - startTime
      };

      logger.info('Deduplication completed', statistics);

      return {
        unique_items: unique,
        duplicates: config.output_duplicates ? duplicates : undefined,
        statistics
      };
    } catch (error) {
      logger.error('Deduplication failed', { error });
      throw error;
    }
  }

  /**
   * Process items in batches for memory efficiency
   */
  private async processBatches(
    items: any[],
    config: RemoveDuplicatesConfig,
    startTime: number
  ): Promise<RemoveDuplicatesResult> {
    const batchSize = config.batch_size || 1000;
    const allUnique: any[] = [];
    const allDuplicates: any[] = [];
    const seenKeys = new Set<string>();

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResult = await this.processItemsBatch(batch, config, seenKeys);
      
      allUnique.push(...batchResult.unique);
      if (config.output_duplicates) {
        allDuplicates.push(...batchResult.duplicates);
      }
    }

    const statistics: DeduplicationStatistics = {
      total_items: items.length,
      unique_items: allUnique.length,
      duplicates_removed: allDuplicates.length,
      processing_time_ms: Date.now() - startTime
    };

    return {
      unique_items: allUnique,
      duplicates: config.output_duplicates ? allDuplicates : undefined,
      statistics
    };
  }

  /**
   * Process a batch of items
   */
  private async processItemsBatch(
    items: any[],
    config: RemoveDuplicatesConfig,
    globalSeenKeys?: Set<string>
  ): Promise<{ unique: any[]; duplicates: any[] }> {
    const seenKeys = globalSeenKeys || new Set<string>();
    const unique: any[] = [];
    const duplicates: any[] = [];

    for (const item of items) {
      try {
        const key = await this.generateKey(item, config);
        
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          unique.push(item);
        } else {
          duplicates.push(item);
        }
      } catch (error) {
        this.handleError(error, item, config);
      }
    }

    return { unique, duplicates };
  }

  /**
   * Process all items and identify duplicates
   */
  private async processItems(
    items: any[],
    config: RemoveDuplicatesConfig
  ): Promise<{ unique: any[]; duplicates: any[] }> {
    return this.processItemsBatch(items, config);
  }

  /**
   * Generate a unique key for an item based on configuration
   */
  private async generateKey(item: any, config: RemoveDuplicatesConfig): Promise<string> {
    switch (config.compare_method) {
      case 'all_fields':
        return await this.hashObject(item, config);

      case 'specific_fields':
        if (!config.fields || config.fields.length === 0) {
          throw new Error('No fields specified for comparison');
        }
        const fieldValues = config.fields.map(field => {
          const value = this.getNestedValue(item, field);
          return this.normalizeValue(value, config);
        });
        return await this.hashObject(fieldValues, config);

      case 'hash':
        return await this.hashObject(item, config);

      case 'custom_function':
        if (!config.custom_function) {
          throw new Error('No custom function provided');
        }
        // Evaluate custom function safely
        return this.evaluateCustomFunction(item, config.custom_function, config);

      default:
        throw new Error(`Unknown compare method: ${config.compare_method}`);
    }
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Normalize value based on smart detection settings
   */
  private normalizeValue(value: any, config: RemoveDuplicatesConfig): any {
    if (typeof value !== 'string') {
      return value;
    }

    let normalized = value;

    if (config.smart_detection?.ignore_case) {
      normalized = normalized.toLowerCase();
    }

    if (config.smart_detection?.normalize_whitespace) {
      normalized = normalized.trim().replace(/\s+/g, ' ');
    }

    return normalized;
  }

  /**
   * Generate hash for an object using Web Crypto API
   */
  private async hashObject(obj: any, config: RemoveDuplicatesConfig): Promise<string> {
    const normalized = this.normalizeValue(JSON.stringify(obj), config);
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Evaluate custom function for key generation
   */
  private evaluateCustomFunction(
    item: any,
    functionCode: string,
    config: RemoveDuplicatesConfig
  ): string {
    try {
      // Create a safe evaluation context
      const func = new Function('item', `return (${functionCode})(item)`);
      const result = func(item);
      return this.normalizeValue(String(result), config);
    } catch (error) {
      logger.error('Custom function evaluation failed', { error, functionCode });
      throw new Error('Invalid custom function');
    }
  }

  /**
   * Handle errors based on configuration
   */
  private handleError(error: any, item: any, config: RemoveDuplicatesConfig): void {
    const errorHandling = config.error_handling;

    if (!errorHandling) {
      throw error;
    }

    switch (errorHandling.on_processing_error) {
      case 'stop':
        throw error;
      
      case 'log':
        logger.warn('Error processing item', { error, item });
        break;
      
      case 'continue':
        // Continue silently
        break;
    }
  }

  /**
   * Calculate fuzzy similarity between two strings (Levenshtein distance)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : 1 - matrix[len1][len2] / maxLen;
  }
}

export const removeDuplicatesService = new RemoveDuplicatesService();
