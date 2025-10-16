import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Secure API storage service using server-side api_connections table
 * Replaces localStorage-based storage to prevent XSS attacks
 */

export interface SecureAPIConfig {
  name: string;
  endpoint: string;
  apiKey?: string;
  description: string;
}

export const secureAPIStorage = {
  /**
   * Load all API connections from server-side storage
   */
  async loadConfigs(): Promise<SecureAPIConfig[]> {
    try {
      const { data: connections, error } = await supabase
        .from('api_connections_metadata')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading API configurations:', error);
        toast.error('Failed to load API configurations');
        return [];
      }

      // Transform to APIConfig format
      return (connections || []).map(conn => ({
        name: conn.service_name,
        endpoint: `https://api.${conn.service_name.toLowerCase()}.com`, // Default endpoint
        description: `${conn.service_name} API`,
        // Note: apiKey is not returned for security - credentials stored encrypted server-side
      }));
    } catch (error) {
      console.error('Error in loadConfigs:', error);
      return [];
    }
  },

  /**
   * Save API configuration to server-side storage
   */
  async saveConfig(config: SecureAPIConfig): Promise<boolean> {
    try {
      // Call the api-connections edge function to handle credential encryption
      const { data, error } = await supabase.functions.invoke('api-connections', {
        body: {
          service_name: config.name,
          auth_type: 'api_key',
          credentials: config.apiKey ? { api_key: config.apiKey } : {},
          endpoint: config.endpoint
        }
      });

      if (error) {
        console.error('Error saving API configuration:', error);
        toast.error('Failed to save API configuration');
        return false;
      }

      toast.success(`API configuration for ${config.name} saved securely`);
      return true;
    } catch (error) {
      console.error('Error in saveConfig:', error);
      return false;
    }
  },

  /**
   * Delete API configuration from server-side storage
   */
  async deleteConfig(connectionId: string): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('api-connections', {
        body: { 
          method: 'DELETE',
          connectionId 
        }
      });

      if (error) {
        console.error('Error deleting API configuration:', error);
        toast.error('Failed to delete API configuration');
        return false;
      }

      toast.success('API configuration deleted');
      return true;
    } catch (error) {
      console.error('Error in deleteConfig:', error);
      return false;
    }
  },

  /**
   * Test API connection
   */
  async testConnection(endpoint: string, apiKey?: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(endpoint, {
        method: 'HEAD',
        headers: apiKey ? {
          'Authorization': `Bearer ${apiKey}`
        } : {},
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
};
