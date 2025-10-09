import { supabase } from '@/integrations/supabase/client';

export interface LegacyWorkflow {
  workflow_id: number;
  name: string;
  category: string | null;
  path: string | null;
  tags: string[];
  notes: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLegacyWorkflowRequest {
  name: string;
  category?: string;
  path?: string;
  tags?: string[];
  notes?: string;
}

export const legacyWorkflowService = {
  // Get all legacy workflows for current user
  getAll: async (): Promise<LegacyWorkflow[]> => {
    const { data, error } = await supabase
      .from('legacy_workflows')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a single legacy workflow
  getById: async (id: number): Promise<LegacyWorkflow | null> => {
    const { data, error } = await supabase
      .from('legacy_workflows')
      .select('*')
      .eq('workflow_id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new legacy workflow
  create: async (workflow: CreateLegacyWorkflowRequest): Promise<LegacyWorkflow> => {
    const { data, error } = await supabase
      .from('legacy_workflows')
      .insert({
        name: workflow.name,
        category: workflow.category || null,
        path: workflow.path || null,
        tags: workflow.tags || [],
        notes: workflow.notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update tags for a workflow
  updateTags: async (id: number, tags: string[]): Promise<void> => {
    const { error } = await supabase
      .from('legacy_workflows')
      .update({ tags })
      .eq('workflow_id', id);

    if (error) throw error;
  },

  // Update notes for a workflow
  updateNotes: async (id: number, notes: string): Promise<void> => {
    const { error } = await supabase
      .from('legacy_workflows')
      .update({ notes })
      .eq('workflow_id', id);

    if (error) throw error;
  },

  // Update entire workflow
  update: async (id: number, updates: Partial<CreateLegacyWorkflowRequest>): Promise<LegacyWorkflow> => {
    const { data, error } = await supabase
      .from('legacy_workflows')
      .update(updates)
      .eq('workflow_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a workflow
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('legacy_workflows')
      .delete()
      .eq('workflow_id', id);

    if (error) throw error;
  },

  // Get workflows by category
  getByCategory: async (category: string): Promise<LegacyWorkflow[]> => {
    const { data, error } = await supabase
      .from('legacy_workflows')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Search workflows by tags
  searchByTags: async (tags: string[]): Promise<LegacyWorkflow[]> => {
    const { data, error } = await supabase
      .from('legacy_workflows')
      .select('*')
      .contains('tags', tags)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
