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

    const url = new URL(req.url);
    const workflowId = url.pathname.split('/').filter(Boolean).pop();

    if (!workflowId) {
      return new Response(
        JSON.stringify({ error: 'Workflow ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Workflow status request:', { workflowId, user_id: user.id });

    // Get latest run for this workflow
    const { data: runs, error } = await supabase
      .from('workflow_runs')
      .select(`
        *,
        workflows!inner(id, name, user_id)
      `)
      .eq('workflow_id', workflowId)
      .order('started_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const latestRun = runs?.[0];

    return new Response(
      JSON.stringify({
        success: true,
        workflow_id: workflowId,
        latest_run: latestRun,
        recent_runs: runs
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Workflow status error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
