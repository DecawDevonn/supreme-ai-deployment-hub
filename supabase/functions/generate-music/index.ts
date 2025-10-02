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
    const { prompt, duration, genre, mood, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate") {
      systemPrompt = `You are an AI music composition assistant. Generate detailed music descriptions based on user prompts. 
Include: instrumentation, tempo, key, structure, and production notes. Be specific and creative.`;
      
      userPrompt = `Create a detailed music composition description for:
Prompt: ${prompt}
Duration: ${duration} seconds
Genre: ${genre || 'any'}
Mood: ${mood || 'any'}

Provide a comprehensive description including instruments, tempo, key, structure, and how it should sound.`;
    } else if (action === "analyze") {
      systemPrompt = `You are a music analysis expert. Analyze music descriptions and provide detailed feedback on composition, structure, and production quality.`;
      userPrompt = `Analyze this music composition: ${prompt}`;
    } else if (action === "remix") {
      systemPrompt = `You are a music remix specialist. Suggest creative remix ideas while maintaining the essence of the original.`;
      userPrompt = `Suggest remix variations for: ${prompt}`;
    }

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
          { role: "user", content: userPrompt }
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
    const musicDescription = data.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({ 
        success: true,
        description: musicDescription,
        metadata: {
          prompt,
          duration,
          genre,
          mood,
          action,
          timestamp: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in generate-music function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process music request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
