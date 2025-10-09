import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // First, verify the user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's token for authentication
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
        auth: { autoRefreshToken: false, persistSession: false }
      }
    );

    // Verify user and admin status
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin using RPC
    const { data: isAdmin, error: adminError } = await supabaseUser.rpc('is_admin', { _user_id: user.id });
    
    if (adminError || !isAdmin) {
      console.error('[persona-management] Admin check failed:', adminError);
      return new Response(
        JSON.stringify({ error: 'Admin access required for persona management' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[persona-management] Admin user authenticated:', user.id);

    // Now use service role key to bypass RLS for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { method } = req;
    const url = new URL(req.url);
    const personaId = url.searchParams.get('persona_id');

    console.log(`[persona-management] ${method} request, persona_id:`, personaId);

    switch (method) {
      case 'GET':
        // Fetch all personas or a specific persona
        if (personaId) {
          const { data, error } = await supabaseClient
            .from('personas')
            .select('*')
            .eq('persona_id', personaId)
            .single();

          if (error) {
            console.error('[persona-management] Error fetching persona:', error);
            throw error;
          }

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          const { data, error } = await supabaseClient
            .from('personas')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('[persona-management] Error fetching personas:', error);
            throw error;
          }

          return new Response(JSON.stringify(data || []), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        // Create a new persona
        const createBody = await req.json();
        console.log('[persona-management] Creating persona:', createBody);

        const { data: createData, error: createError } = await supabaseClient
          .from('personas')
          .insert({
            persona_id: createBody.id,
            name: createBody.name,
            role: createBody.role,
            archetype: createBody.archetype,
            identity: createBody.identity || {},
            traits: createBody.traits || {},
            skills: createBody.skills || {},
            boundaries: createBody.boundaries || {},
            memory_hooks: createBody.memory_hooks || {},
            raw_schema: createBody,
          })
          .select()
          .single();

        if (createError) {
          console.error('[persona-management] Error creating persona:', createError);
          throw createError;
        }

        return new Response(JSON.stringify(createData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });

      case 'PUT':
        // Update an existing persona
        if (!personaId) {
          throw new Error('persona_id is required for updates');
        }

        const updateBody = await req.json();
        console.log('[persona-management] Updating persona:', personaId, updateBody);

        const { data: updateData, error: updateError } = await supabaseClient
          .from('personas')
          .update({
            name: updateBody.name,
            role: updateBody.role,
            archetype: updateBody.archetype,
            identity: updateBody.identity,
            traits: updateBody.traits,
            skills: updateBody.skills,
            boundaries: updateBody.boundaries,
            memory_hooks: updateBody.memory_hooks,
            raw_schema: updateBody,
          })
          .eq('persona_id', personaId)
          .select()
          .single();

        if (updateError) {
          console.error('[persona-management] Error updating persona:', updateError);
          throw updateError;
        }

        return new Response(JSON.stringify(updateData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        // Delete a persona
        if (!personaId) {
          throw new Error('persona_id is required for deletion');
        }

        console.log('[persona-management] Deleting persona:', personaId);

        const { error: deleteError } = await supabaseClient
          .from('personas')
          .delete()
          .eq('persona_id', personaId);

        if (deleteError) {
          console.error('[persona-management] Error deleting persona:', deleteError);
          throw deleteError;
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('[persona-management] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
