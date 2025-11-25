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
    const { message, level, history } = await req.json();
    
    console.log(`Therapy session - Level ${level}:`, message);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Define therapy personas by level
    const personas = {
      1: 'You are a compassionate AI therapy assistant (Level 1 - Supportive Listener). Provide empathetic listening, validation, and gentle encouragement. Focus on emotional support and basic coping strategies. Keep responses warm and accessible.',
      2: 'You are an advanced AI therapist (Level 2 - Cognitive Guide). Use CBT techniques, help identify thought patterns, suggest reframing exercises. Balance support with practical cognitive tools.',
      3: 'You are a deep-insight AI therapist (Level 3 - Depth Analyst). Explore underlying patterns, family systems, attachment styles. Offer profound insights while maintaining safety and boundaries.',
      4: 'You are a transformational AI therapist (Level 4 - Transformational Guide). Integrate existential, transpersonal, and somatic approaches. Guide deep healing and personal transformation with wisdom and care.'
    };

    const systemPrompt = personas[level] || personas[1];

    // Build message history
    const messages = [
      { role: 'system', content: systemPrompt + '\n\nIMPORTANT: If user expresses crisis/harm intent, recommend professional help immediately. Monitor for safety concerns.' },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('AI therapy response failed');
    }

    const aiData = await aiResponse.json();
    const response = aiData.choices[0]?.message?.content || '';

    // Safety check for crisis keywords
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'self-harm'];
    const containsCrisis = crisisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    return new Response(
      JSON.stringify({ 
        response,
        safetyAlert: containsCrisis,
        crisisResources: containsCrisis ? [
          '988 - Suicide & Crisis Lifeline',
          'Crisis Text Line: Text HOME to 741741',
          'Emergency: 911'
        ] : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in therapy-session:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Therapy session failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
