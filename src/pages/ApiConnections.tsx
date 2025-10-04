import React, { useState, useEffect } from 'react';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { ApiConnectionsService, ApiConnection } from '@/services/api/apiConnectionsService';
import AddConnectionDialog from '@/components/api/AddConnectionDialog';
import ApiConnectionCard from '@/components/api/ApiConnectionCard';

const ApiConnections: React.FC = () => {
  const [connections, setConnections] = useState<ApiConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadConnections = async () => {
    setIsLoading(true);
    try {
      const data = await ApiConnectionsService.getConnections();
      setConnections(data);
    } catch (error) {
      console.error('Error loading connections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load API connections. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  return (
    <div className="min-h-screen">
      <Container maxWidth="2xl" className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">API Connections</h1>
              <p className="text-muted-foreground">
                Manage your external API connections for workflows and agents
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={loadConnections}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Connection
              </Button>
            </div>
          </div>

          {/* Connections Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading connections...
            </div>
          ) : connections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No API connections yet. Add your first connection to get started.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Connection
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map((connection) => (
                <ApiConnectionCard
                  key={connection.id}
                  connection={connection}
                  onUpdate={loadConnections}
                />
              ))}
            </div>
          )}
        </motion.div>
      </Container>

      <AddConnectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={loadConnections}
      />
    </div>
  );
};

export default ApiConnections;
