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
    const { prompt, genre, lyrics } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    // Generate lyrics if not provided
    let finalLyrics = lyrics;
    if (!lyrics) {
      const lyricsResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are a professional songwriter. Write complete, creative song lyrics with verse, chorus, and bridge.' },
            { role: 'user', content: `Write ${genre} song lyrics about: ${prompt}` }
          ],
        }),
      });

      const lyricsData = await lyricsResponse.json();
      finalLyrics = lyricsData.choices[0].message.content;
    }

    // In production, integrate with Suno or similar API
    // For now, return mock data
    const mockSong = {
      url: 'https://example.com/generated-song.mp3',
      title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Song: ${prompt.slice(0, 30)}`,
      lyrics: finalLyrics
    };

    return new Response(JSON.stringify(mockSong), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Music generation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
