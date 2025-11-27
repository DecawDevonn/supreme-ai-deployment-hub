import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.2';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define validation schema for chat request
const ChatPayloadSchema = z.object({
  personaId: z.string().uuid("personaId must be a valid UUID"),
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message is too long"),
  conversationId: z.string().uuid().optional(),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with user's token
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Validate user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    const rawBody = await req.json();
    const validationResult = ChatPayloadSchema.safeParse(rawBody);

    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.issues);
      return new Response(
        JSON.stringify({ 
          error: 'Input validation failed', 
          details: validationResult.error.issues
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { personaId, message, conversationId } = validationResult.data;

    // Verify persona exists and user has access
    const { data: persona, error: personaError } = await supabase
      .from('personas')
      .select('*')
      .eq('persona_id', personaId)
      .single();

    if (personaError || !persona) {
      console.error('Persona not found:', personaError);
      return new Response(
        JSON.stringify({ error: 'Persona not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get or create conversation
    let activeConversationId = conversationId;
    if (!activeConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: `Chat with ${persona.name}`,
          metadata: { persona_id: personaId }
        })
        .select()
        .single();

      if (convError || !newConversation) {
        console.error('Failed to create conversation:', convError);
        return new Response(
          JSON.stringify({ error: 'Failed to create conversation' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      activeConversationId = newConversation.id;
    }

    // Store user message
    const { error: msgError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: activeConversationId,
        role: 'user',
        content: message
      });

    if (msgError) {
      console.error('Failed to store user message:', msgError);
    }

    // Get persona prompt for system message
    const { data: personaPrompt } = await supabase
      .from('persona_prompts')
      .select('system_prompt')
      .eq('persona_id', personaId)
      .single();

    // Get conversation history
    const { data: messageHistory } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', activeConversationId)
      .order('created_at', { ascending: true })
      .limit(20);

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const messages = [
      {
        role: 'system',
        content: personaPrompt?.system_prompt || `You are ${persona.name}, ${persona.role}.`
      },
      ...(messageHistory || []),
    ];

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
      }),
    });

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;

    // Store assistant response
    const { error: assistantMsgError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: activeConversationId,
        role: 'assistant',
        content: assistantMessage
      });

    if (assistantMsgError) {
      console.error('Failed to store assistant message:', assistantMsgError);
    }

    return new Response(
      JSON.stringify({ 
        message: assistantMessage,
        conversationId: activeConversationId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in devonn-chat:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
