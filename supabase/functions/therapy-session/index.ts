import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { message, level } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const levelPrompts = {
      1: "You are a compassionate therapist helping with daily stress and emotions. Provide supportive, practical guidance.",
      2: "You are a depth psychologist exploring subconscious patterns and beliefs. Help identify underlying patterns.",
      3: "You are a Jungian analyst working with archetypal symbols and myths. Explore deeper symbolic meanings.",
      4: "You are a transpersonal therapist facilitating connection with universal consciousness. Guide toward transcendent insights."
    };

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: `${levelPrompts[level as keyof typeof levelPrompts]} IMPORTANT: Monitor for crisis indicators. If user expresses self-harm or danger, immediately respond with crisis resources.` },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();
    const therapyResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: therapyResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Therapy session error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
