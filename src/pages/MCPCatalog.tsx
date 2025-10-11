import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, TrendingUp, Star } from 'lucide-react';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import MCPServerCard from '@/components/mcp/MCPServerCard';
import { mcpCatalogService } from '@/services/mcp/mcpCatalogService';
import { useToast } from '@/hooks/use-toast';
import type { MCPServerCategory } from '@/types/mcp';

const MCPCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MCPServerCategory | 'all'>('all');
  const { toast } = useToast();

  const catalog = useMemo(() => mcpCatalogService.getCatalog(), []);
  
  const filteredServers = useMemo(() => {
    let servers = catalog.servers;

    if (selectedCategory !== 'all') {
      servers = servers.filter(s => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      servers = mcpCatalogService.searchServers(searchQuery);
    }

    return servers;
  }, [catalog.servers, selectedCategory, searchQuery]);

  const featuredServers = useMemo(() => mcpCatalogService.getFeaturedServers(), []);
  const trendingServers = useMemo(() => mcpCatalogService.getTrendingServers(), []);

  const handleEnableServer = (serverId: string) => {
    const server = mcpCatalogService.getServerById(serverId);
    if (server) {
      toast({
        title: 'Server Enabled',
        description: `${server.name} has been enabled. Configure credentials to start using it.`,
      });
    }
  };

  const handleConfigureServer = (serverId: string) => {
    const server = mcpCatalogService.getServerById(serverId);
    if (server) {
      toast({
        title: 'Configure Server',
        description: `Opening configuration for ${server.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Container maxWidth="2xl" className="py-12">
        <SectionHeading
          centered
          animate
          tag="MCP Ecosystem"
          subheading="Browse and enable MCP servers from the Docker catalog"
        >
          MCP Server Catalog
        </SectionHeading>

        <div className="mt-8 mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search servers, providers, or capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>All</TabsTrigger>
            <TabsTrigger value="featured" onClick={() => setSelectedCategory('all')}>
              <Star className="h-4 w-4 mr-1" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="trending" onClick={() => setSelectedCategory('all')}>
              <TrendingUp className="h-4 w-4 mr-1" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="developer-tools" onClick={() => setSelectedCategory('developer-tools')}>Dev Tools</TabsTrigger>
            <TabsTrigger value="databases" onClick={() => setSelectedCategory('databases')}>Databases</TabsTrigger>
            <TabsTrigger value="search" onClick={() => setSelectedCategory('search')}>Search</TabsTrigger>
            <TabsTrigger value="productivity" onClick={() => setSelectedCategory('productivity')}>Productivity</TabsTrigger>
            <TabsTrigger value="finance" onClick={() => setSelectedCategory('finance')}>Finance</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServers.map(server => (
                <MCPServerCard
                  key={server.id}
                  server={server}
                  onEnable={handleEnableServer}
                  onConfigure={handleConfigureServer}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServers.map(server => (
                <MCPServerCard
                  key={server.id}
                  server={server}
                  onEnable={handleEnableServer}
                  onConfigure={handleConfigureServer}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingServers.map(server => (
                <MCPServerCard
                  key={server.id}
                  server={server}
                  onEnable={handleEnableServer}
                  onConfigure={handleConfigureServer}
                />
              ))}
            </div>
          </TabsContent>

          {['developer-tools', 'databases', 'search', 'productivity', 'finance'].map(category => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServers.map(server => (
                  <MCPServerCard
                    key={server.id}
                    server={server}
                    onEnable={handleEnableServer}
                    onConfigure={handleConfigureServer}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {filteredServers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No servers found matching your criteria.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default MCPCatalog;
