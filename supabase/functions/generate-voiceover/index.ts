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
    const { screenplay } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Extract narration from screenplay
    const narrationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: 'Extract or create a compelling voiceover narration from the screenplay. Keep it concise, cinematic, and engaging.'
          },
          {
            role: 'user',
            content: `Create voiceover narration for this screenplay:\n\n${screenplay}`
          }
        ],
      }),
    });

    const narrationData = await narrationResponse.json();
    const narration = narrationData.choices[0].message.content;

    console.log('Generated narration:', narration.slice(0, 100));

    // For production, integrate with ElevenLabs or similar TTS API
    // For now, return placeholder
    const mockAudioUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav';

    return new Response(
      JSON.stringify({ 
        audioUrl: mockAudioUrl,
        narration,
        message: 'Voice generation requires ElevenLabs API key. Add as secret to enable.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
