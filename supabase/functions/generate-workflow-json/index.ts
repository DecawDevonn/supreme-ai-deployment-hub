import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateString, validateObject } from '../_shared/validation.ts';

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
    
    // Validate domain
    const domainResult = validateString(body.domain, 'domain', 1, 100);
    if (!domainResult.success) {
      return new Response(
        JSON.stringify({ error: domainResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const domain = domainResult.data;
    
    // Validate template
    const templateResult = validateObject(body.template, 'template');
    if (!templateResult.success) {
      return new Response(
        JSON.stringify({ error: templateResult.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const template = templateResult.data;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating workflow JSON for domain:', domain);

    const systemPrompt = `You are an expert n8n workflow designer. Your task is to fill an empty n8n workflow JSON template.

**INSTRUCTIONS:**
1. Analyze the user's GOAL: "${prompt}"
2. Generate a complete and correct JSON object containing the required \`nodes\` and \`connections\` arrays for a functional n8n workflow that achieves the GOAL.
3. The output MUST be a single JSON object. DO NOT include any explanatory text, markdown formatting other than the JSON block, or any variable names outside of the JSON structure.
4. The output MUST contain the two keys: \`"nodes"\` (an array of n8n node objects) and \`"connections"\` (an object mapping node outputs to inputs).
5. Use common nodes like:
   - n8n-nodes-base.start (workflow start trigger)
   - n8n-nodes-base.webhook (webhook trigger)
   - n8n-nodes-base.function (custom JavaScript code)
   - n8n-nodes-base.httpRequest (HTTP requests)
   - n8n-nodes-base.set (set/transform data)
   - n8n-nodes-base.if (conditional logic)
   - n8n-nodes-openai.openAi (OpenAI integration)
   - n8n-nodes-base.slack (Slack integration)
   - n8n-nodes-base.gmail (Gmail integration)
   - n8n-nodes-base.googleSheets (Google Sheets)

**TEMPLATE STRUCTURE TO FILL:**
${JSON.stringify(template, null, 2)}

**DOMAIN CONTEXT:** ${domain}

**YOUR JSON OUTPUT (return ONLY the JSON, no markdown, no explanations):**`;

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: 'Generate the n8n workflow JSON now.'
          }
        ],
        temperature: 0.7,
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
    let generatedContent = data.choices[0].message.content.trim();
    
    // Remove markdown code block formatting if present
    generatedContent = generatedContent.replace(/^```json\s*\n/i, '').replace(/\n```$/i, '');
    generatedContent = generatedContent.replace(/^```\s*\n/i, '').replace(/\n```$/i, '');
    
    console.log('Generated workflow JSON (first 500 chars):', generatedContent.substring(0, 500));

    // Parse to validate JSON
    let workflowData;
    try {
      workflowData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse generated JSON:', parseError);
      console.error('Raw content:', generatedContent);
      throw new Error('Generated content is not valid JSON');
    }

    // Validate structure
    if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
      throw new Error('Generated workflow missing valid nodes array');
    }
    if (!workflowData.connections || typeof workflowData.connections !== 'object') {
      throw new Error('Generated workflow missing valid connections object');
    }

    return new Response(
      JSON.stringify({ workflow: workflowData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-workflow-json:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
