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
    const { strategy, symbol, startDate, endDate, initialCapital } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a quantitative trading analyst. Simulate trading strategies and provide detailed backtesting results with realistic market conditions.`;
    
    const userPrompt = `Backtest this trading strategy:
Strategy: ${strategy}
Symbol: ${symbol}
Period: ${startDate} to ${endDate}
Initial Capital: $${initialCapital}

Generate a realistic backtest with:
1. Trade history (at least 10-20 trades)
2. Performance metrics (total return, Sharpe ratio, max drawdown, win rate)
3. Equity curve data points
4. Risk analysis
5. Strategy effectiveness assessment

Format as JSON with structure:
{
  "trades": [{"date": "...", "type": "buy/sell", "price": 0, "quantity": 0, "profit": 0}],
  "metrics": {"totalReturn": 0, "sharpeRatio": 0, "maxDrawdown": 0, "winRate": 0, "totalTrades": 0},
  "equityCurve": [{"date": "...", "value": 0}],
  "analysis": "..."
}`;

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
    const resultText = data.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse result" };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in backtest-strategy:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
