import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-mcp-gateway-url",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface McpProxyRequest {
  method: string;
  params?: Record<string, unknown>;
  gatewayUrl?: string;
}

// Default backend URL: prefer custom domain, fall back to ALB hostname
// MCP_GATEWAY_URL can be set via Supabase Edge Function secrets:
//   supabase secrets set MCP_GATEWAY_URL=https://api.devonn.ai/mcp --project-ref bqkpxdjmpbucenbppxzc
const DEFAULT_GATEWAY_URL =
  "http://devonn-alb-managed-2012536228.us-west-2.elb.amazonaws.com/api/mcp";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: McpProxyRequest = await req.json();

    // Priority: request header > request body > env var > ALB default
    const gatewayUrl =
      req.headers.get("x-mcp-gateway-url") ??
      body.gatewayUrl ??
      Deno.env.get("MCP_GATEWAY_URL") ??
      DEFAULT_GATEWAY_URL;

    console.log(`[mcp-gateway] Proxying ${body.method} to ${gatewayUrl}`);

    // Build JSON-RPC request
    const rpcRequest = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: body.method,
      params: body.params ?? {},
    };

    // Forward to MCP Gateway backend
    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rpcRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[mcp-gateway] Gateway error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: rpcRequest.id,
          error: {
            code: response.status,
            message: `Gateway error: ${errorText}`,
          },
        }),
        {
          status: 200, // Return 200 with JSON-RPC error
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = await response.json();
    console.log(`[mcp-gateway] Response:`, JSON.stringify(result).slice(0, 200));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[mcp-gateway] Error:", error);
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : "Internal error",
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
