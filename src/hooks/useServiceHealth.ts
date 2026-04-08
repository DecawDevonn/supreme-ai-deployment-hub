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

const DEFAULT_ENDPOINTS: ServiceEndpoint[] = [
  { id: "fastapi", name: "FastAPI", url: "http://localhost:8000/health", description: "Main API orchestration service", icon: "⚡" },
  { id: "n8n", name: "n8n Workflows", url: "http://localhost:5678/healthz", description: "Workflow automation engine", icon: "🔄" },
  { id: "mcp-gateway", name: "MCP Gateway", url: "http://localhost:3001/health", description: "Model Context Protocol server", icon: "🔌" },
  { id: "openclawd", name: "OpenClawd", url: "http://localhost:8080/health", description: "AI model inference service", icon: "🧠" },
  { id: "postgres", name: "PostgreSQL", url: "http://localhost:5432", description: "Primary database", icon: "🗄️" },
  { id: "redis", name: "Redis", url: "http://localhost:6379", description: "Cache & message broker", icon: "📦" },
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
