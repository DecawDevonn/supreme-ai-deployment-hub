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
    const { prompt, style, duration } = await req.json();
    
    console.log('Generating music:', { prompt, style, duration });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate song lyrics and structure
    const lyricsResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: 'You are an expert songwriter and music producer. Create professional song structures with verses, chorus, bridge, and compelling lyrics.'
          },
          {
            role: 'user',
            content: `Create a complete song (${duration || 3} minutes) in ${style || 'pop'} style about: ${prompt}\n\nInclude:\n- Song title\n- Full lyrics (verses, chorus, bridge)\n- Musical arrangement notes\n- Mood and instrumentation\n- Tempo and key suggestions`
          }
        ],
        temperature: 0.9,
      }),
    });

    if (!lyricsResponse.ok) {
      throw new Error('Failed to generate song structure');
    }

    const lyricsData = await lyricsResponse.json();
    const songDetails = lyricsData.choices[0]?.message?.content || '';

    // In production, this would call Suno API or similar for actual audio generation
    const audioUrl = `data:text/plain,${encodeURIComponent('Music generation ready:\n\n' + songDetails + '\n\nIn production, this would generate actual audio using Suno API or similar music AI service.')}`;

    console.log('Music concept generated');

    return new Response(
      JSON.stringify({ 
        audioUrl,
        songDetails,
        message: 'Song structure generated. Audio generation would use Suno/Udio APIs in production.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-music:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate music' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
