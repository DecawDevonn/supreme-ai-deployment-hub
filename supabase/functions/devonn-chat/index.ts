import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { validateChatMessages, validateUUID, validateString } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate conversationId
    const conversationIdResult = validateUUID(body.conversationId, 'conversationId');
    if (!conversationIdResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: conversationIdResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const conversationId = conversationIdResult.data;
    
    // Validate messages
    const messagesResult = validateChatMessages(body.messages);
    if (!messagesResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: messagesResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const messages = messagesResult.data;
    
    const action = body.action || 'chat';
    const personaId = body.personaId;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let systemPrompt = 'You are Devonn, a helpful AI assistant with knowledge graph capabilities. Analyze conversations and identify key entities (people, places, concepts) and their relationships.';
    
    if (personaId) {
      const { data: persona } = await supabase
        .from('personas')
        .select('*, persona_prompts(*)')
        .eq('persona_id', personaId)
        .single();
      
      if (persona && persona.persona_prompts && persona.persona_prompts.length > 0) {
        systemPrompt = persona.persona_prompts[0].system_prompt;
      }
    }

    const chatResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      console.error('AI Gateway error:', chatResponse.status, errorText);
      
      if (chatResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (chatResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${chatResponse.status}`);
    }

    const chatData = await chatResponse.json();
    const aiResponse = chatData.choices?.[0]?.message?.content || 'No response generated';

    const kgExtractionPrompt = `Analyze this conversation and extract:
1. Key entities (people, places, concepts, things) with their types
2. Relationships between entities

Conversation:
${messages.map((m: any) => `${m.role}: ${m.content}`).join('\n')}

Assistant response: ${aiResponse}

Return a JSON object with this structure:
{
  "entities": [{"type": "person|place|concept|thing", "name": "entity name", "properties": {}}],
  "relationships": [{"from": "entity1", "to": "entity2", "type": "relationship type"}]
}`;

    const kgResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert at extracting structured knowledge from conversations. Always return valid JSON.' },
          { role: 'user', content: kgExtractionPrompt }
        ],
        temperature: 0.3,
      }),
    });

    let entities: any[] = [];
    let relationships: any[] = [];

    if (kgResponse.ok) {
      const kgData = await kgResponse.json();
      const kgContent = kgData.choices?.[0]?.message?.content || '{}';
      
      try {
        const jsonMatch = kgContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extracted = JSON.parse(jsonMatch[0]);
          entities = extracted.entities || [];
          relationships = extracted.relationships || [];
        }
      } catch (e) {
        console.error('Error parsing KG extraction:', e);
      }
    }

    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content: lastUserMessage.content,
        metadata: {}
      });
    }

    await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: aiResponse,
      metadata: { entities, relationships }
    });

    if (entities.length > 0) {
      const entityInserts = entities.map((e: any) => ({
        conversation_id: conversationId,
        entity_type: e.type || 'concept',
        entity_name: e.name,
        properties: e.properties || {}
      }));
      await supabase.from('knowledge_graph_entities').insert(entityInserts);
    }

    if (relationships.length > 0) {
      const relInserts = relationships.map((r: any) => ({
        conversation_id: conversationId,
        from_entity: r.from,
        to_entity: r.to,
        relationship_type: r.type,
        properties: {}
      }));
      await supabase.from('knowledge_graph_relationships').insert(relInserts);
    }

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return new Response(
      JSON.stringify({ 
        success: true,
        response: aiResponse,
        entities,
        relationships,
        workflows: [],
        metadata: {
          model: 'google/gemini-2.5-flash',
          conversationId,
          personaId
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in devonn-chat function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
