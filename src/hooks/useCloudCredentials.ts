import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CloudProvider } from '@/types/deployment';

export interface CloudCredentials {
  id: string;
  provider: CloudProvider;
  region: string;
  is_active: boolean;
  last_validated_at: string | null;
  created_at: string;
}

export interface AWSCredentialsInput {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export const useCloudCredentials = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<CloudCredentials | null>(null);

  const fetchCredentials = useCallback(async (provider: CloudProvider) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cloud_credentials')
        .select('*')
        .eq('provider', provider)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const cred: CloudCredentials = {
          id: data.id,
          provider: data.provider as CloudProvider,
          region: data.region || '',
          is_active: data.is_active,
          last_validated_at: data.last_validated_at,
          created_at: data.created_at,
        };
        setCredentials(cred);
        return cred;
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching credentials:', error);
      toast.error('Failed to fetch credentials');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveAWSCredentials = useCallback(async (input: AWSCredentialsInput) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Use secure server-side encryption via edge function
      const credentialsJson = {
        accessKeyId: input.accessKeyId,
        secretAccessKey: input.secretAccessKey,
        region: input.region,
      };

      const { data: encryptionResult, error: encryptError } = await supabase.functions.invoke(
        'cloud-credentials-encrypt',
        {
          body: {
            action: 'encrypt',
            credentials: credentialsJson,
          },
        }
      );

      if (encryptError || !encryptionResult?.encrypted) {
        throw new Error('Failed to encrypt credentials securely');
      }

      const encryptedCredentials = encryptionResult.encrypted;

      // First, deactivate any existing AWS credentials
      await supabase
        .from('cloud_credentials')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('provider', 'aws');

      // Insert new credentials
      const { data, error } = await supabase
        .from('cloud_credentials')
        .insert([{
          user_id: user.id,
          provider: 'aws',
          credentials: encryptedCredentials,
          region: input.region,
          is_active: true,
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const cred: CloudCredentials = {
          id: data.id,
          provider: 'aws',
          region: data.region || '',
          is_active: data.is_active,
          last_validated_at: data.last_validated_at,
          created_at: data.created_at,
        };
        setCredentials(cred);
        toast.success('AWS credentials saved successfully');
        
        // Validate credentials
        await validateCredentials('aws');
        
        return cred;
      }
      return null;
    } catch (error: any) {
      console.error('Error saving credentials:', error);
      toast.error(error.message || 'Failed to save credentials');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateCredentials = useCallback(async (provider: CloudProvider) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('aws-eks-deploy', {
        body: { action: 'validate' },
      });

      if (error) throw error;

      if (data.valid) {
        // Update last validated timestamp
        await supabase
          .from('cloud_credentials')
          .update({ last_validated_at: new Date().toISOString() })
          .eq('provider', provider)
          .eq('is_active', true);

        toast.success('Credentials validated successfully');
        return true;
      } else {
        toast.error('Invalid credentials');
        return false;
      }
    } catch (error: any) {
      console.error('Error validating credentials:', error);
      toast.error('Failed to validate credentials');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCredentials = useCallback(async (provider: CloudProvider) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cloud_credentials')
        .delete()
        .eq('provider', provider)
        .eq('is_active', true);

      if (error) throw error;

      setCredentials(null);
      toast.success('Credentials deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting credentials:', error);
      toast.error('Failed to delete credentials');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    credentials,
    isLoading,
    fetchCredentials,
    saveAWSCredentials,
    validateCredentials,
    deleteCredentials,
  };
};
