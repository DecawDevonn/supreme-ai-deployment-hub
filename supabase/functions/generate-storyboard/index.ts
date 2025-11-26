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

    // Extract key scenes from screenplay
    const scenesResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: 'You are a visual storytelling expert. Extract 4-6 key visual moments from the screenplay and describe each as a detailed image prompt for AI generation.'
          },
          {
            role: 'user',
            content: `Extract 4-6 key visual moments from this screenplay and create detailed image prompts:\n\n${screenplay}\n\nReturn as JSON array: [{"scene": "Scene 1", "prompt": "detailed visual description"}]`
          }
        ],
      }),
    });

    const scenesData = await scenesResponse.json();
    let scenes;
    
    try {
      const content = scenesData.choices[0].message.content;
      scenes = JSON.parse(content.match(/\[[\s\S]*\]/)?.[0] || '[]');
    } catch {
      // Fallback if parsing fails
      scenes = [
        { scene: "Opening", prompt: "Cinematic establishing shot" },
        { scene: "Mid", prompt: "Character close-up" },
        { scene: "Climax", prompt: "Action sequence" },
        { scene: "Ending", prompt: "Final scene" }
      ];
    }

    // Generate images for each scene using Lovable AI image generation
    const imagePromises = scenes.slice(0, 6).map(async (scene: any) => {
      const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image',
          messages: [
            {
              role: 'user',
              content: `${scene.prompt}. Cinematic, 16:9 aspect ratio, professional filmmaking style.`
            }
          ],
          modalities: ['image', 'text']
        }),
      });

      const imageData = await imageResponse.json();
      const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      return imageUrl || 'https://via.placeholder.com/800x450?text=Storyboard+Frame';
    });

    const images = await Promise.all(imagePromises);

    return new Response(
      JSON.stringify({ images, scenes }),
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
