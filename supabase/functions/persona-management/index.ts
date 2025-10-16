import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const personaSchema = z.object({
  id: z.string().min(1).max(100).optional(),
  persona_id: z.string().min(1).max(100).optional(),
  name: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  archetype: z.string().max(100).optional(),
  identity: z.record(z.unknown()).optional(),
  traits: z.record(z.unknown()).optional(),
  skills: z.record(z.unknown()).optional(),
  boundaries: z.record(z.unknown()).optional(),
  memory_hooks: z.record(z.unknown()).optional(),
});

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
            console.error('[INTERNAL] Error fetching persona:', error);
            return new Response(JSON.stringify({ error: 'Failed to fetch persona' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
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
            console.error('[INTERNAL] Error fetching personas:', error);
            return new Response(JSON.stringify({ error: 'Failed to fetch personas' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify(data || []), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        // Create a new persona
        const createBody = await req.json();
        
        // Validate input
        const validatedCreate = personaSchema.parse(createBody);
        console.log('[persona-management] Creating persona');

        const { data: createData, error: createError } = await supabaseClient
          .from('personas')
          .insert({
            persona_id: validatedCreate.id || validatedCreate.persona_id,
            name: validatedCreate.name,
            role: validatedCreate.role,
            archetype: validatedCreate.archetype,
            identity: validatedCreate.identity || {},
            traits: validatedCreate.traits || {},
            skills: validatedCreate.skills || {},
            boundaries: validatedCreate.boundaries || {},
            memory_hooks: validatedCreate.memory_hooks || {},
            raw_schema: createBody,
          })
          .select()
          .single();

        if (createError) {
          console.error('[INTERNAL] Error creating persona:', createError);
          return new Response(JSON.stringify({ error: 'Failed to create persona' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(createData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });

      case 'PUT':
        // Update an existing persona
        if (!personaId) {
          return new Response(JSON.stringify({ error: 'persona_id is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const updateBody = await req.json();
        
        // Validate input (partial update)
        const validatedUpdate = personaSchema.partial().parse(updateBody);
        console.log('[persona-management] Updating persona');

        const { data: updateData, error: updateError } = await supabaseClient
          .from('personas')
          .update({
            ...(validatedUpdate.name && { name: validatedUpdate.name }),
            ...(validatedUpdate.role && { role: validatedUpdate.role }),
            ...(validatedUpdate.archetype && { archetype: validatedUpdate.archetype }),
            ...(validatedUpdate.identity && { identity: validatedUpdate.identity }),
            ...(validatedUpdate.traits && { traits: validatedUpdate.traits }),
            ...(validatedUpdate.skills && { skills: validatedUpdate.skills }),
            ...(validatedUpdate.boundaries && { boundaries: validatedUpdate.boundaries }),
            ...(validatedUpdate.memory_hooks && { memory_hooks: validatedUpdate.memory_hooks }),
            raw_schema: updateBody,
          })
          .eq('persona_id', personaId)
          .select()
          .single();

        if (updateError) {
          console.error('[INTERNAL] Error updating persona:', updateError);
          return new Response(JSON.stringify({ error: 'Failed to update persona' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(updateData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        // Delete a persona
        if (!personaId) {
          return new Response(JSON.stringify({ error: 'persona_id is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('[persona-management] Deleting persona:', personaId);

        const { error: deleteError } = await supabaseClient
          .from('personas')
          .delete()
          .eq('persona_id', personaId);

        if (deleteError) {
          console.error('[INTERNAL] Error deleting persona:', deleteError);
          return new Response(JSON.stringify({ error: 'Failed to delete persona' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
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
    console.error('[INTERNAL] Error:', error);
    
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ 
        error: 'Invalid input data',
        details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
