import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Plug, 
  PlugZap, 
  RefreshCw, 
  Play, 
  ChevronDown, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  Wrench
} from "lucide-react";
import { useMcpGateway } from "@/hooks/useMcpGateway";
import type { McpTool, McpToolResult } from "@/lib/mcp";

export function McpToolExplorer() {
  const {
    isConnected,
    isConnecting,
    session,
    tools,
    error,
    connect,
    disconnect,
    refreshTools,
    callTool,
  } = useMcpGateway();

  const [gatewayUrl, setGatewayUrl] = useState("http://localhost:8080/mcp");
  const [selectedTool, setSelectedTool] = useState<McpTool | null>(null);
  const [toolArgs, setToolArgs] = useState<string>("{}");
  const [toolResult, setToolResult] = useState<McpToolResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleConnect = async () => {
    await connect(gatewayUrl);
  };

  const handleCallTool = async () => {
    if (!selectedTool) return;

    setIsExecuting(true);
    setToolResult(null);

    try {
      const args = JSON.parse(toolArgs);
      const result = await callTool(selectedTool.name, args);
      setToolResult(result);
    } catch (err) {
      setToolResult({
        content: [{ type: "text", text: err instanceof Error ? err.message : "Tool call failed" }],
        isError: true,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <PlugZap className="h-5 w-5 text-green-500" />
            ) : (
              <Plug className="h-5 w-5 text-muted-foreground" />
            )}
            MCP Gateway Connection
          </CardTitle>
          <CardDescription>
            Connect to Docker MCP Gateway to access tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Gateway URL (e.g., http://localhost:8080/mcp)"
              value={gatewayUrl}
              onChange={(e) => setGatewayUrl(e.target.value)}
              disabled={isConnected}
            />
            {isConnected ? (
              <Button variant="outline" onClick={disconnect}>
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {session && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Connected to {session.serverInfo?.name ?? "MCP Gateway"}
              </span>
              <Badge variant="secondary">{tools.length} tools available</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tools List */}
      {isConnected && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Available Tools
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={refreshTools}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {tools.map((tool) => (
                  <Collapsible key={tool.name}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant={selectedTool?.name === tool.name ? "secondary" : "ghost"}
                        className="w-full justify-between"
                        onClick={() => {
                          setSelectedTool(tool);
                          setToolArgs(JSON.stringify(
                            Object.fromEntries(
                              Object.entries(tool.inputSchema?.properties ?? {}).map(
                                ([key, prop]) => [key, prop.default ?? ""]
                              )
                            ),
                            null,
                            2
                          ));
                        }}
                      >
                        <span className="font-mono text-sm">{tool.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 py-2 text-sm text-muted-foreground">
                      {tool.description ?? "No description available"}
                      {tool.inputSchema?.properties && (
                        <div className="mt-2 space-y-1">
                          <span className="font-medium">Parameters:</span>
                          {Object.entries(tool.inputSchema.properties).map(([key, prop]) => (
                            <div key={key} className="flex items-center gap-2 text-xs">
                              <code className="bg-muted px-1 rounded">{key}</code>
                              <span className="text-muted-foreground">({prop.type})</span>
                              {tool.inputSchema?.required?.includes(key) && (
                                <Badge variant="outline" className="text-xs">required</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Tool Execution */}
      {selectedTool && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Execute: {selectedTool.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Arguments (JSON)</label>
              <textarea
                className="w-full h-32 font-mono text-sm p-3 rounded-md border bg-muted"
                value={toolArgs}
                onChange={(e) => setToolArgs(e.target.value)}
                placeholder='{"param1": "value1"}'
              />
            </div>

            <Button onClick={handleCallTool} disabled={isExecuting}>
              {isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Execute Tool
                </>
              )}
            </Button>

            {toolResult && (
              <div className={`p-4 rounded-md ${toolResult.isError ? "bg-destructive/10" : "bg-muted"}`}>
                <div className="text-sm font-medium mb-2">
                  {toolResult.isError ? "Error" : "Result"}
                </div>
                <ScrollArea className="h-[200px]">
                  <pre className="text-xs whitespace-pre-wrap">
                    {toolResult.content.map((c, i) => (
                      <div key={i}>{c.text ?? JSON.stringify(c, null, 2)}</div>
                    ))}
                  </pre>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
