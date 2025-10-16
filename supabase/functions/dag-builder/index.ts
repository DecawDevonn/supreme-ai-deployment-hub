import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateString, validateWorkflowDefinition, validateUUID } from '../_shared/validation.ts';

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

    const body = await req.json();
    
    // Validate name
    const nameResult = validateString(body.name, 'name', 1, 255);
    if (!nameResult.success) {
      return new Response(
        JSON.stringify({ error: nameResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const name = nameResult.data;
    
    // Validate description
    const descriptionResult = validateString(body.description || '', 'description', 0, 1000);
    if (!descriptionResult.success) {
      return new Response(
        JSON.stringify({ error: descriptionResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const description = descriptionResult.data;
    
    // Validate definition
    const definitionResult = validateWorkflowDefinition(body.definition);
    if (!definitionResult.success) {
      return new Response(
        JSON.stringify({ error: definitionResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const definition = definitionResult.data;
    
    const executor = ['supabase', 'n8n', 'zapier'].includes(body.executor) ? body.executor : 'supabase';
    
    // Validate ID if provided
    let id = body.id;
    if (id) {
      const idResult = validateUUID(id, 'id');
      if (!idResult.success) {
        return new Response(
          JSON.stringify({ error: idResult.error }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      id = idResult.data;
    }

    console.log('DAG Builder request:', { id, name, user_id: user.id });

    let result;
    if (id) {
      // Update existing workflow
      const { data, error } = await supabase
        .from('workflows')
        .update({
          name,
          description,
          definition,
          executor,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new workflow
      const { data, error } = await supabase
        .from('workflows')
        .insert({
          user_id: user.id,
          name,
          description,
          definition,
          executor
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return new Response(
      JSON.stringify({
        success: true,
        workflow_id: result.id,
        workflow: result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('DAG Builder error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
