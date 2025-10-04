import { supabase } from '@/integrations/supabase/client';

export interface UserFeature {
  id: string;
  user_id: string;
  feature_name: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const FeatureService = {
  // Get all features for the current user
  getUserFeatures: async (): Promise<UserFeature[]> => {
    const { data, error } = await supabase
      .from('user_features')
      .select('*');

    if (error) {
      console.error('Error fetching user features:', error);
      throw error;
    }

    return data || [];
  },

  // Get a specific feature status
  getFeatureStatus: async (featureName: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('user_features')
      .select('enabled')
      .eq('feature_name', featureName)
      .maybeSingle();

    if (error) {
      console.error('Error fetching feature status:', error);
      return false;
    }

    return data?.enabled || false;
  },

  // Toggle a feature on/off
  toggleFeature: async (featureName: string, enabled: boolean): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('toggle-feature', {
        body: { feature_name: featureName, enabled },
      });

      if (error) {
        console.error('Error toggling feature:', error);
        throw error;
      }

      return data.success;
    } catch (error) {
      console.error('Error in toggleFeature:', error);
      throw error;
    }
  },
};
