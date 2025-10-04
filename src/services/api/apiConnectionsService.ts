import { supabase } from '@/integrations/supabase/client';

export type AuthType = 'api_key' | 'oauth2' | 'basic_auth' | 'bearer_token';

export interface ApiConnection {
  id: string;
  service_name: string;
  auth_type: AuthType;
  is_valid: boolean;
  last_validated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateConnectionRequest {
  service_name: string;
  auth_type: AuthType;
  credentials: Record<string, any>;
}

export const ApiConnectionsService = {
  // Get all API connections for the current user
  getConnections: async (): Promise<ApiConnection[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('api-connections', {
        method: 'GET',
      });

      if (error) throw error;
      return data.data || [];
    } catch (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }
  },

  // Create a new API connection
  createConnection: async (request: CreateConnectionRequest): Promise<{ connection: ApiConnection; validated: boolean }> => {
    try {
      const { data, error } = await supabase.functions.invoke('api-connections', {
        method: 'POST',
        body: request,
      });

      if (error) throw error;
      return { connection: data.data, validated: data.validated };
    } catch (error) {
      console.error('Error creating connection:', error);
      throw error;
    }
  },

  // Delete an API connection
  deleteConnection: async (connectionId: string): Promise<void> => {
    try {
      const { error } = await supabase.functions.invoke(`api-connections/${connectionId}`, {
        method: 'DELETE',
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting connection:', error);
      throw error;
    }
  },

  // Validate/re-validate an API connection
  validateConnection: async (connectionId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke(`api-connections/${connectionId}/validate`, {
        method: 'POST',
      });

      if (error) throw error;
      return data.is_valid;
    } catch (error) {
      console.error('Error validating connection:', error);
      throw error;
    }
  },
};
