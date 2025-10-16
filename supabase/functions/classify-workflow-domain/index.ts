import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateString } from '../_shared/validation.ts';

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
    
    // Validate prompt
    const promptResult = validateString(body.prompt, 'prompt', 1, 5000);
    if (!promptResult.success) {
      return new Response(
        JSON.stringify({ error: promptResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const prompt = promptResult.data;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Classifying workflow domain for prompt:', prompt);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a classification engine for n8n workflow templates. 
Analyze the user's request and output ONLY the matching domain keyword from this list: creative, productivity, analytics, sales, deployment, automation, integration, notification.

Rules:
- creative: AI-enhanced content creation, film production, image/video generation
- productivity: Task management, scheduling, document processing
- analytics: Data analysis, reporting, metrics tracking
- sales: Lead management, CRM integration, email campaigns
- deployment: CI/CD, infrastructure automation, container orchestration
- automation: General workflow automation, data transformation
- integration: API connections, webhook handlers, data sync
- notification: Alerts, messaging, communication workflows

Output ONLY the domain keyword. No explanations, no additional text.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required, please add funds to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const domain = data.choices[0].message.content.trim().toLowerCase();
    
    console.log('Classified domain:', domain);

    return new Response(
      JSON.stringify({ domain }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in classify-workflow-domain:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
