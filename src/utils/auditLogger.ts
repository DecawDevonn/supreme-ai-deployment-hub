import { supabase } from '@/integrations/supabase/client';

/**
 * Securely logs API usage and other audit events to the database
 * instead of localStorage for better security
 */
export const logAuditEvent = async (eventType: string, details: Record<string, any>) => {
  try {
    const { error } = await supabase.rpc('log_api_usage', {
      event_type_in: eventType,
      details_in: details,
    });

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (e) {
    console.error('Error during audit logging:', e);
  }
};

/**
 * Common event types for consistency
 */
export const AuditEventTypes = {
  API_CONNECTION_ADDED: 'API_CONNECTION_ADDED',
  API_CONNECTION_REMOVED: 'API_CONNECTION_REMOVED',
  API_CONNECTION_TEST_SUCCESS: 'API_CONNECTION_TEST_SUCCESS',
  API_CONNECTION_TEST_FAILED: 'API_CONNECTION_TEST_FAILED',
  API_KEY_UPDATED: 'API_KEY_UPDATED',
  ENCRYPTION_OPERATION: 'ENCRYPTION_OPERATION',
} as const;
