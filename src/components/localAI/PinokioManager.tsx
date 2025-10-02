import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePinokio } from '@/hooks/usePinokio';
import {
  Download,
  Play,
  Square,
  Trash2,
  RefreshCw,
  Search,
  Cpu,
  HardDrive,
  Monitor,
  Loader2,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Zap
} from 'lucide-react';

const categoryIcons: Record<string, string> = {
  'image-generation': '🎨',
  'llm': '🤖',
  'audio': '🎵',
  'video': '🎬',
  'voice': '🎤',
  'utility': '🛠️'
};

const PinokioManager = () => {
  const {
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
    searchTools
  } = usePinokio();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    searchTools(searchQuery);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/10 text-green-500';
      case 'installed':
        return 'bg-blue-500/10 text-blue-500';
      case 'installing':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'error':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Zap className="h-8 w-8" />
            Pinokio AI Manager
          </h1>
          <p className="text-muted-foreground">
            One-click installer for open-source AI tools - run everything locally
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {installedTools.length} Tools Installed
        </Badge>
      </div>

      {/* System Info */}
      {systemInfo && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Cpu className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">CPU</p>
                  <p className="text-xl font-bold">{systemInfo.cpuCores} Cores</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <HardDrive className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">RAM</p>
                  <p className="text-xl font-bold">{systemInfo.totalRAM}GB</p>
                  <p className="text-xs text-muted-foreground">
                    {systemInfo.availableRAM}GB available
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Monitor className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">GPU</p>
                  <p className="text-lg font-bold truncate">
                    {systemInfo.gpuName || 'None'}
                  </p>
                  {systemInfo.gpuVRAM && (
                    <p className="text-xs text-muted-foreground">{systemInfo.gpuVRAM}GB VRAM</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <HardDrive className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Storage</p>
                  <p className="text-xl font-bold">{systemInfo.availableStorage}GB</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="installed">
            Installed ({installedTools.length})
          </TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'image-generation', 'llm', 'audio', 'video', 'voice', 'utility'].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat as any)}
              >
                {cat === 'all' ? '🌟 All' : `${categoryIcons[cat]} ${cat}`}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[600px]">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalog.map((tool) => {
                const progress = installProgress.get(tool.id);
                const isInstalled = installedTools.some(t => t.id === tool.id);

                return (
                  <Card key={tool.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">{tool.icon}</span>
                            {tool.name}
                          </CardTitle>
                          <CardDescription className="mt-1">{tool.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Version</span>
                          <Badge variant="outline">{tool.version}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Size</span>
                          <span className="font-medium">{tool.installSize}GB</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Category</span>
                          <Badge>{tool.category}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 text-xs">
                          {tool.requirements.gpuRequired && (
                            <Badge variant="secondary" className="text-xs">
                              GPU Required ({tool.requirements.minVRAM}GB VRAM)
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {tool.requirements.minRAM}GB RAM
                          </Badge>
                        </div>

                        {progress && progress.status !== 'complete' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>{progress.currentStep}</span>
                              <span>{progress.progress}%</span>
                            </div>
                            <Progress value={progress.progress} />
                          </div>
                        ) : isInstalled ? (
                          <Button variant="outline" className="w-full" disabled>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Installed
                          </Button>
                        ) : (
                          <Button
                            onClick={() => installTool(tool)}
                            disabled={loading}
                            className="w-full"
                          >
                            {loading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 mr-2" />
                            )}
                            Install
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Installed Tab */}
        <TabsContent value="installed" className="space-y-4">
          {installedTools.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Tools Installed</h3>
                <p className="text-muted-foreground mb-4">
                  Browse the Discover tab to install AI tools
                </p>
                <Button onClick={() => setSelectedCategory('all')}>
                  Browse Catalog
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {installedTools.map((tool) => (
                  <Card key={tool.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <span className="text-3xl">{tool.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{tool.name}</h3>
                              <Badge className={getStatusColor(tool.status)}>
                                {tool.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {tool.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>v{tool.version}</span>
                              <span>{tool.installSize}GB</span>
                              {tool.lastRun && (
                                <span>
                                  Last run: {new Date(tool.lastRun).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {tool.status === 'running' ? (
                            <>
                              {tool.webUIPort && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(`http://localhost:${tool.webUIPort}`, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => stopTool(tool)}
                                disabled={loading}
                              >
                                <Square className="h-4 w-4 mr-2" />
                                Stop
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => runTool(tool)}
                              disabled={loading}
                            >
                              {loading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4 mr-2" />
                              )}
                              Run
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTool(tool)}
                            disabled={loading}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => uninstallTool(tool)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PinokioManager;
