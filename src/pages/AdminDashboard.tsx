import React, { useState, useEffect } from 'react';
import Container from '@/components/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { AdminBootstrap } from '@/components/admin/AdminBootstrap';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, Database, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface SystemStats {
  totalUsers: number;
  totalPersonas: number;
  totalWorkflows: number;
  totalApiConnections: number;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin, loading } = useAdminStatus();
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalPersonas: 0,
    totalWorkflows: 0,
    totalApiConnections: 0,
  });

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      const [personas, workflows, connections] = await Promise.all([
        supabase.from('personas').select('id', { count: 'exact', head: true }),
        supabase.from('workflows').select('id', { count: 'exact', head: true }),
        supabase.from('api_connections_metadata').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: 0, // Would need service role to count auth.users
        totalPersonas: personas.count || 0,
        totalWorkflows: workflows.count || 0,
        totalApiConnections: connections.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Container maxWidth="2xl" className="py-16">
          <AdminBootstrap />
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Admin access required to view this page.
            </AlertDescription>
          </Alert>
        </Container>
      </div>
    );
  }

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
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage system settings, personas, and monitor platform usage
            </p>
          </div>

          <AdminBootstrap />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Personas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalPersonas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalWorkflows}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  API Connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalApiConnections}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  System Status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-green-500">Operational</div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="personas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personas">Personas</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="personas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Persona Management</CardTitle>
                  <CardDescription>
                    Create and manage AI personas for the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Use the Personas API or edge function to manage personas programmatically.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage user roles and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    User management features coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>
                    Configure system-wide settings and features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Database:</span>
                      <span className="font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Authentication:</span>
                      <span className="font-medium">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Edge Functions:</span>
                      <span className="font-medium">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
