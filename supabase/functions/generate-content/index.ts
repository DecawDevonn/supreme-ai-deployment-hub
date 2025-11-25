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
    const { contentType, topic, style, duration } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (contentType) {
      case "video":
        systemPrompt = "You are a video content creator. Generate detailed video scripts, scene descriptions, and production notes.";
        userPrompt = `Create a ${duration} video script about: ${topic}\nStyle: ${style}\n\nInclude scene breakdowns, dialogue, and visual descriptions.`;
        break;
      
      case "podcast":
        systemPrompt = "You are a podcast producer. Create engaging podcast scripts with natural dialogue and segment structure.";
        userPrompt = `Create a ${duration} podcast episode about: ${topic}\nStyle: ${style}\n\nInclude intro, segments, talking points, and outro.`;
        break;
      
      case "article":
        systemPrompt = "You are a content writer. Create well-structured, engaging articles with proper formatting.";
        userPrompt = `Write an article about: ${topic}\nStyle: ${style}\nLength: ${duration}\n\nInclude headline, sections, and call-to-action.`;
        break;
      
      default:
        throw new Error("Invalid content type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        content,
        metadata: {
          contentType,
          topic,
          style,
          duration,
          createdAt: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-content:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
