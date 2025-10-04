import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { workflow_id, params = {} } = await req.json();

    console.log('Workflow run request:', { workflow_id, user_id: user.id });

    // Get workflow definition
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflow_id)
      .single();

    if (workflowError) throw workflowError;

    // Create workflow run
    const { data: run, error: runError } = await supabase
      .from('workflow_runs')
      .insert({
        workflow_id,
        status: 'running',
        input_params: params,
        logs: [{ timestamp: new Date().toISOString(), message: 'Workflow started' }]
      })
      .select()
      .single();

    if (runError) throw runError;

    // Execute workflow in background
    EdgeRuntime.waitUntil(executeWorkflow(supabase, run.id, workflow, params));

    return new Response(
      JSON.stringify({
        success: true,
        run_id: run.id,
        status: 'running'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Workflow run error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function executeWorkflow(supabase: any, runId: string, workflow: any, params: any) {
  const logs: any[] = [];
  
  try {
    const { definition } = workflow;
    const { nodes = [], edges = [] } = definition;

    // Build execution order (topological sort)
    const executionOrder = topologicalSort(nodes, edges);
    
    logs.push({ timestamp: new Date().toISOString(), message: `Executing ${executionOrder.length} nodes` });

    const nodeResults: Record<string, any> = {};

    // Execute nodes in order
    for (const nodeId of executionOrder) {
      const node = nodes.find((n: any) => n.id === nodeId);
      if (!node) continue;

      logs.push({ timestamp: new Date().toISOString(), message: `Executing node: ${node.name}` });

      try {
        const result = await executeNode(node, nodeResults, params);
        nodeResults[nodeId] = result;
        logs.push({ 
          timestamp: new Date().toISOString(), 
          message: `Node ${node.name} completed successfully`,
          result 
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        logs.push({ 
          timestamp: new Date().toISOString(), 
          message: `Node ${node.name} failed: ${errorMsg}`,
          error: errorMsg
        });
        throw error;
      }
    }

    // Update run as success
    await supabase
      .from('workflow_runs')
      .update({
        status: 'success',
        logs,
        output_data: nodeResults,
        finished_at: new Date().toISOString()
      })
      .eq('id', runId);

    console.log('Workflow completed successfully:', runId);

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logs.push({ timestamp: new Date().toISOString(), message: `Workflow failed: ${errorMsg}` });
    
    await supabase
      .from('workflow_runs')
      .update({
        status: 'failed',
        logs,
        error_message: errorMsg,
        finished_at: new Date().toISOString()
      })
      .eq('id', runId);

    console.error('Workflow execution failed:', runId, error);
  }
}

async function executeNode(node: any, previousResults: Record<string, any>, params: any): Promise<any> {
  const { type, parameters } = node;

  switch (type) {
    case 'http':
      return await executeHttpNode(parameters, previousResults, params);
    case 'supabase':
      return await executeSupabaseNode(parameters, previousResults, params);
    case 'ai':
      return await executeAINode(parameters, previousResults, params);
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}

async function executeHttpNode(params: any, previousResults: Record<string, any>, inputParams: any): Promise<any> {
  const { url, method = 'GET', headers = {}, body } = params;
  
  const processedUrl = replaceVariables(url, previousResults, inputParams);
  const processedBody = body ? replaceVariables(JSON.stringify(body), previousResults, inputParams) : undefined;

  const response = await fetch(processedUrl, {
    method,
    headers,
    body: processedBody
  });

  return await response.json();
}

async function executeSupabaseNode(params: any, previousResults: Record<string, any>, inputParams: any): Promise<any> {
  // Placeholder for Supabase operations
  return { success: true, message: 'Supabase node execution' };
}

async function executeAINode(params: any, previousResults: Record<string, any>, inputParams: any): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

  const { prompt, model = 'google/gemini-2.5-flash' } = params;
  const processedPrompt = replaceVariables(prompt, previousResults, inputParams);

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: processedPrompt }],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

function replaceVariables(text: string, previousResults: Record<string, any>, params: any): string {
  let result = text;
  
  // Replace {{node.result}} patterns
  result = result.replace(/\{\{(\w+)\.(\w+)\}\}/g, (_, nodeId, key) => {
    return previousResults[nodeId]?.[key] ?? '';
  });
  
  // Replace {{param}} patterns
  result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key] ?? '';
  });
  
  return result;
}

function topologicalSort(nodes: any[], edges: any[]): string[] {
  const graph: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

  // Initialize graph
  nodes.forEach(node => {
    graph[node.id] = [];
    inDegree[node.id] = 0;
  });

  // Build graph
  edges.forEach(edge => {
    graph[edge.source]?.push(edge.target);
    inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
  });

  // Find nodes with no dependencies
  const queue = nodes.filter(node => inDegree[node.id] === 0).map(n => n.id);
  const result: string[] = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    result.push(nodeId);

    graph[nodeId]?.forEach(neighbor => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }

  return result;
}
