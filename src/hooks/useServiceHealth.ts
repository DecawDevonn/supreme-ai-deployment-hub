import { useState, useEffect, useCallback } from "react";

export interface ServiceEndpoint {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string;
}

export interface ServiceStatus {
  id: string;
  name: string;
  url: string;
  status: "online" | "offline" | "checking" | "unknown";
  latency: number | null;
  lastChecked: Date | null;
  error?: string;
}

// Production backend URLs — EKS cluster on AWS (us-west-2)
const BACKEND_URL = import.meta.env.VITE_API_URL || "https://api.devonn.ai";
const MCP_GATEWAY_URL =
  import.meta.env.VITE_MCP_GATEWAY_URL ||
  "https://bqkpxdjmpbucenbppxzc.supabase.co/functions/v1/mcp-gateway";

const DEFAULT_ENDPOINTS: ServiceEndpoint[] = [
  { id: "backend", name: "Devonn Backend", url: `${BACKEND_URL}/api/health`, description: "Flask API on EKS (Flask + MongoDB + Redis)", icon: "⚡" },
  { id: "mcp-gateway", name: "MCP Gateway", url: MCP_GATEWAY_URL, description: "Supabase edge function → EKS MCP proxy", icon: "🔌" },
  { id: "openclawd", name: "OpenClawd", url: `${BACKEND_URL}/api/health`, description: "AI model inference service", icon: "🧠" },
  { id: "redis", name: "Redis (ElastiCache)", url: `${BACKEND_URL}/api/health`, description: "AWS ElastiCache Redis cache", icon: "📦" },
  { id: "mongodb", name: "DocumentDB", url: `${BACKEND_URL}/api/health`, description: "AWS DocumentDB (MongoDB-compatible)", icon: "🗄️" },
];

const STORAGE_KEY = "devonn-service-endpoints";

export function useServiceHealth() {
  const [endpoints, setEndpoints] = useState<ServiceEndpoint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ENDPOINTS;
    } catch {
      return DEFAULT_ENDPOINTS;
    }
  });

  const [statuses, setStatuses] = useState<Record<string, ServiceStatus>>({});
  const [isChecking, setIsChecking] = useState(false);

  const saveEndpoints = useCallback((eps: ServiceEndpoint[]) => {
    setEndpoints(eps);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eps));
  }, []);

  const checkService = useCallback(async (endpoint: ServiceEndpoint): Promise<ServiceStatus> => {
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(endpoint.url, {
        method: "GET",
        signal: controller.signal,
        mode: "no-cors",
      });
      clearTimeout(timeout);

      const latency = Math.round(performance.now() - start);
      return {
        id: endpoint.id,
        name: endpoint.name,
        url: endpoint.url,
        status: "online",
        latency,
        lastChecked: new Date(),
      };
    } catch (err: any) {
      const latency = Math.round(performance.now() - start);
      // no-cors requests that succeed will be opaque but won't throw
      // AbortError = timeout, TypeError = network error
      return {
        id: endpoint.id,
        name: endpoint.name,
        url: endpoint.url,
        status: "offline",
        latency: err.name === "AbortError" ? null : latency,
        lastChecked: new Date(),
        error: err.name === "AbortError" ? "Timeout (5s)" : "Connection refused",
      };
    }
  }, []);

  const checkAll = useCallback(async () => {
    setIsChecking(true);
    // Mark all as checking
    const checking: Record<string, ServiceStatus> = {};
    endpoints.forEach((ep) => {
      checking[ep.id] = { id: ep.id, name: ep.name, url: ep.url, status: "checking", latency: null, lastChecked: null };
    });
    setStatuses(checking);

    const results = await Promise.all(endpoints.map(checkService));
    const newStatuses: Record<string, ServiceStatus> = {};
    results.forEach((r) => { newStatuses[r.id] = r; });
    setStatuses(newStatuses);
    setIsChecking(false);
  }, [endpoints, checkService]);

  const addEndpoint = useCallback((endpoint: Omit<ServiceEndpoint, "id">) => {
    const newEp = { ...endpoint, id: crypto.randomUUID() };
    saveEndpoints([...endpoints, newEp]);
  }, [endpoints, saveEndpoints]);

  const updateEndpoint = useCallback((id: string, updates: Partial<ServiceEndpoint>) => {
    saveEndpoints(endpoints.map((ep) => (ep.id === id ? { ...ep, ...updates } : ep)));
  }, [endpoints, saveEndpoints]);

  const removeEndpoint = useCallback((id: string) => {
    saveEndpoints(endpoints.filter((ep) => ep.id !== id));
    setStatuses((prev) => { const next = { ...prev }; delete next[id]; return next; });
  }, [endpoints, saveEndpoints]);

  const resetToDefaults = useCallback(() => {
    saveEndpoints(DEFAULT_ENDPOINTS);
  }, [saveEndpoints]);

  // Auto-check on mount
  useEffect(() => {
    checkAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    endpoints,
    statuses,
    isChecking,
    checkAll,
    addEndpoint,
    updateEndpoint,
    removeEndpoint,
    resetToDefaults,
  };
}
