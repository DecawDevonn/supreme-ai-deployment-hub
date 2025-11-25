import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentType, task } = await req.json();
    
    console.log('Running money agent:', { agentType, task });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Define agent personas and capabilities
    const agentPrompts = {
      'content-creator': 'You are an AI content creation specialist. Generate blog post ideas, social media content, video scripts, and SEO-optimized articles. Provide actionable content strategies.',
      'market-researcher': 'You are an AI market research analyst. Identify trending products, analyze market gaps, evaluate competition, and suggest profitable niches.',
      'freelance-finder': 'You are an AI freelance opportunity scout. Find high-paying gigs, craft winning proposals, identify client needs, and suggest skill development paths.',
      'affiliate-optimizer': 'You are an AI affiliate marketing strategist. Find profitable affiliate programs, optimize conversion strategies, and create compelling promotional content.',
      'ecommerce-helper': 'You are an AI e-commerce consultant. Optimize product listings, suggest pricing strategies, identify trending products, and improve store conversions.',
      'investment-advisor': 'You are an AI investment research assistant. Analyze market trends, evaluate investment opportunities, and provide educational insights (not financial advice).',
    };

    const systemPrompt = agentPrompts[agentType] || 'You are a helpful AI assistant for making money online legally and ethically.';

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: systemPrompt + '\n\nProvide specific, actionable advice. Include concrete steps, tools, and timeframes. Focus on legitimate, sustainable income strategies.'
          },
          {
            role: 'user',
            content: task || 'Suggest the top 3 money-making opportunities in this category right now.'
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('AI agent response failed');
    }

    const aiData = await aiResponse.json();
    const response = aiData.choices[0]?.message?.content || '';

    // Simulate earnings calculation (in production, would track actual results)
    const estimatedEarnings = Math.floor(Math.random() * 500) + 50;

    return new Response(
      JSON.stringify({ 
        response,
        estimatedEarnings,
        agentType,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in money-agent:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Money agent failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
