import { useState, useCallback, useEffect } from 'react';
import { PinokioService } from '@/services/localAI/pinokioService';
import type { AITool, InstallationProgress, SystemInfo } from '@/services/localAI/pinokioService';
import { toast } from 'sonner';

export function usePinokio() {
  const [catalog, setCatalog] = useState<AITool[]>([]);
  const [installedTools, setInstalledTools] = useState<AITool[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [installProgress, setInstallProgress] = useState<Map<string, InstallationProgress>>(new Map());
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AITool['category'] | 'all'>('all');

  const loadCatalog = useCallback(async (category?: AITool['category']) => {
    setLoading(true);
    try {
      const data = category 
        ? await PinokioService.getToolCatalog(category)
        : await PinokioService.getPopularTools();
      setCatalog(data);
    } catch (error) {
      console.error('Error loading catalog:', error);
      toast.error('Failed to load tool catalog');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInstalledTools = useCallback(async () => {
    try {
      const data = await PinokioService.getInstalledTools();
      setInstalledTools(data);
    } catch (error) {
      console.error('Error loading installed tools:', error);
    }
  }, []);

  const loadSystemInfo = useCallback(async () => {
    try {
      const data = await PinokioService.getSystemInfo();
      setSystemInfo(data);
    } catch (error) {
      console.error('Error loading system info:', error);
    }
  }, []);

  const installTool = useCallback(async (tool: AITool) => {
    // Check compatibility first
    const compatibility = await PinokioService.checkCompatibility(tool.id);
    
    if (!compatibility.compatible) {
      toast.error(`Cannot install ${tool.name}: ${compatibility.issues.join(', ')}`);
      return;
    }

    if (compatibility.warnings.length > 0) {
      toast.warning(`Warning: ${compatibility.warnings.join(', ')}`);
    }

    setLoading(true);
    try {
      const progress = await PinokioService.installTool(tool.id);
      setInstallProgress(prev => new Map(prev).set(tool.id, progress));
      
      toast.success(`Started installing ${tool.name}`);
      
      // Poll for progress
      const pollInterval = setInterval(async () => {
        const currentProgress = await PinokioService.getInstallationProgress(tool.id);
        setInstallProgress(prev => new Map(prev).set(tool.id, currentProgress));
        
        if (currentProgress.status === 'complete') {
          clearInterval(pollInterval);
          toast.success(`${tool.name} installed successfully!`);
          await loadInstalledTools();
          await loadCatalog(selectedCategory === 'all' ? undefined : selectedCategory);
        } else if (currentProgress.status === 'failed') {
          clearInterval(pollInterval);
          toast.error(`Failed to install ${tool.name}: ${currentProgress.error}`);
        }
      }, 2000);

      return () => clearInterval(pollInterval);
    } catch (error) {
      console.error('Error installing tool:', error);
      toast.error(`Failed to install ${tool.name}`);
    } finally {
      setLoading(false);
    }
  }, [loadInstalledTools, loadCatalog, selectedCategory]);

  const uninstallTool = useCallback(async (tool: AITool) => {
    if (!confirm(`Are you sure you want to uninstall ${tool.name}? This will remove all downloaded models and data.`)) {
      return;
    }

    setLoading(true);
    try {
      await PinokioService.uninstallTool(tool.id);
      toast.success(`${tool.name} uninstalled successfully`);
      await loadInstalledTools();
      await loadCatalog(selectedCategory === 'all' ? undefined : selectedCategory);
    } catch (error) {
      console.error('Error uninstalling tool:', error);
      toast.error(`Failed to uninstall ${tool.name}`);
    } finally {
      setLoading(false);
    }
  }, [loadInstalledTools, loadCatalog, selectedCategory]);

  const runTool = useCallback(async (tool: AITool) => {
    setLoading(true);
    try {
      const result = await PinokioService.runTool(tool.id);
      
      if (result.webUIUrl) {
        toast.success(`${tool.name} is running!`, {
          action: {
            label: 'Open',
            onClick: () => window.open(result.webUIUrl, '_blank')
          }
        });
      } else {
        toast.success(`${tool.name} is running on port ${result.port}`);
      }
      
      await loadInstalledTools();
    } catch (error) {
      console.error('Error running tool:', error);
      toast.error(`Failed to run ${tool.name}`);
    } finally {
      setLoading(false);
    }
  }, [loadInstalledTools]);

  const stopTool = useCallback(async (tool: AITool) => {
    setLoading(true);
    try {
      await PinokioService.stopTool(tool.id);
      toast.success(`${tool.name} stopped`);
      await loadInstalledTools();
    } catch (error) {
      console.error('Error stopping tool:', error);
      toast.error(`Failed to stop ${tool.name}`);
    } finally {
      setLoading(false);
    }
  }, [loadInstalledTools]);

  const updateTool = useCallback(async (tool: AITool) => {
    setLoading(true);
    try {
      const progress = await PinokioService.updateTool(tool.id);
      setInstallProgress(prev => new Map(prev).set(tool.id, progress));
      toast.success(`Started updating ${tool.name}`);
    } catch (error) {
      console.error('Error updating tool:', error);
      toast.error(`Failed to update ${tool.name}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchTools = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadCatalog(selectedCategory === 'all' ? undefined : selectedCategory);
      return;
    }

    setLoading(true);
    try {
      const results = await PinokioService.searchTools(query);
      setCatalog(results);
    } catch (error) {
      console.error('Error searching tools:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  }, [loadCatalog, selectedCategory]);

  // Load initial data
  useEffect(() => {
    loadCatalog();
    loadInstalledTools();
    loadSystemInfo();
  }, []);

  // Reload catalog when category changes
  useEffect(() => {
    loadCatalog(selectedCategory === 'all' ? undefined : selectedCategory);
  }, [selectedCategory, loadCatalog]);

  return {
    catalog,
    installedTools,
    systemInfo,
    installProgress,
    loading,
    selectedCategory,
    setSelectedCategory,
    installTool,
    uninstallTool,
    runTool,
    stopTool,
    updateTool,
    searchTools,
    loadCatalog,
    loadInstalledTools
  };
}
