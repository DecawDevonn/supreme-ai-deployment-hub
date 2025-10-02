import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface KGEntity {
  type: string;
  name: string;
  properties?: Record<string, any>;
}

interface KGRelationship {
  from: string;
  to: string;
  type: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // System prompt with Knowledge Graph awareness
    const systemPrompt = `You are Devonn.ai Copilot - an intelligent assistant with Knowledge Graph awareness.

Core Capabilities:
1. **Knowledge Graph Updates**: Extract entities and relationships from conversations
2. **Workflow Automation**: Help with CI/CD, GitHub issues, deployments
3. **Cloud Integration**: AWS EKS, RunPod GPU, Kubernetes orchestration
4. **Developer Tools**: Code review, testing, infrastructure management

When responding:
- Identify entities (Services, Deployments, Issues, People, Tools)
- Suggest relationships between entities
- Provide actionable workflow recommendations
- Track conversation context and state

Return responses in JSON format:
{
  "message": "Your response text",
  "entities": [{"type": "Service", "name": "example", "properties": {}}],
  "relationships": [{"from": "A", "to": "B", "type": "DEPLOYED_ON"}],
  "workflows": [{"name": "workflow_name", "trigger": "event", "actions": []}],
  "metadata": {"confidence": 0.9, "topics": ["deployment", "k8s"]}
}`;

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content;

    // Try to parse structured response
    let parsedResponse: any = {
      message: aiResponse,
      entities: [],
      relationships: [],
      workflows: [],
      metadata: {}
    };

    try {
      // Check if response is JSON
      if (aiResponse.includes('{') && aiResponse.includes('}')) {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      console.log("Response is plain text, not JSON");
    }

    // Store conversation if conversationId provided
    if (conversationId) {
      await supabase.from('chat_messages').insert([
        {
          conversation_id: conversationId,
          role: 'user',
          content: messages[messages.length - 1].content,
          created_at: new Date().toISOString()
        },
        {
          conversation_id: conversationId,
          role: 'assistant',
          content: parsedResponse.message,
          metadata: parsedResponse,
          created_at: new Date().toISOString()
        }
      ]);

      // Update Knowledge Graph if entities found
      if (parsedResponse.entities && parsedResponse.entities.length > 0) {
        await supabase.from('knowledge_graph_entities').insert(
          parsedResponse.entities.map((entity: KGEntity) => ({
            conversation_id: conversationId,
            entity_type: entity.type,
            entity_name: entity.name,
            properties: entity.properties || {},
            created_at: new Date().toISOString()
          }))
        );
      }

      // Store relationships
      if (parsedResponse.relationships && parsedResponse.relationships.length > 0) {
        await supabase.from('knowledge_graph_relationships').insert(
          parsedResponse.relationships.map((rel: KGRelationship) => ({
            conversation_id: conversationId,
            from_entity: rel.from,
            to_entity: rel.to,
            relationship_type: rel.type,
            created_at: new Date().toISOString()
          }))
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        response: parsedResponse.message,
        entities: parsedResponse.entities || [],
        relationships: parsedResponse.relationships || [],
        workflows: parsedResponse.workflows || [],
        metadata: parsedResponse.metadata || {},
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in devonn-chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process chat request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
