
import { supabase } from "@/integrations/supabase/client";
import { DAGWorkflow, DAGResponse } from "@/types/agent";

export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  parameters: Record<string, any>;
  position?: { x: number; y: number };
}

export interface WorkflowEdge {
  source: string;
  target: string;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface VisualWorkflow {
  id?: string;
  name: string;
  description?: string;
  definition: WorkflowDefinition;
  executor?: 'supabase' | 'n8n' | 'webhook';
}

export interface VisualWorkflowResponse {
  success: boolean;
  workflow_id?: string;
  run_id?: string;
  status?: string;
  error?: string;
}

// Visual workflow API (for n8n-style visual workflow builder)
export const visualWorkflowApi = {
  // Create/update a visual workflow
  saveWorkflow: async (workflow: VisualWorkflow): Promise<VisualWorkflowResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('dag-builder', {
        body: workflow
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving workflow:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },
  
  // Execute a workflow
  runWorkflow: async (workflowId: string, params?: any): Promise<VisualWorkflowResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('workflow-run', {
        body: { workflow_id: workflowId, params }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error running workflow:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },
  
  // Get workflow status
  getWorkflowStatus: async (workflowId: string): Promise<VisualWorkflowResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('workflow-status', {
        body: { workflow_id: workflowId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching workflow status:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
};

// Agent-based DAG workflow API (YAML-based workflows with agents)
export const workflowApi = {
  submitDAG: async (dag: DAGWorkflow): Promise<DAGResponse> => {
    // This still needs backend implementation for agent-based workflows
    console.error("Agent DAG workflows not yet implemented in backend");
    return {
      workflow_id: "",
      status: "error",
      error: "Agent DAG workflows not yet implemented"
    };
  },
  
  getWorkflowStatus: async (workflowId: string): Promise<DAGResponse> => {
    console.error("Agent DAG status not yet implemented");
    return {
      workflow_id: workflowId,
      status: "error",
      error: "Not implemented"
    };
  }
};
