import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminBootstrap: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      // Check if any admins exist
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (rolesError) throw rolesError;
      
      setHasAdmins((roles?.length || 0) > 0);

      // Check if current user is admin
      const { data: isAdmin } = await supabase.rpc('is_admin', {
        _user_id: user.id
      });
      
      setIsCurrentUserAdmin(isAdmin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const becomeAdmin = async () => {
    if (!user) return;

    setIsProcessing(true);
    try {
      const { data: success, error } = await supabase.rpc('claim_first_admin', {
        _user_id: user.id
      });

      if (error) throw error;

      if (success) {
        toast({
          title: 'Success',
          description: 'You are now an admin. Please refresh the page.',
        });
        await checkAdminStatus();
      } else {
        toast({
          title: 'Info',
          description: 'Another user has already claimed admin privileges.',
          variant: 'default',
        });
        await checkAdminStatus();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to set admin role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || hasAdmins === null) return null;

  if (isCurrentUserAdmin) {
    return (
      <Alert className="mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          You have admin privileges. You can manage personas and system settings.
        </AlertDescription>
      </Alert>
    );
  }

  if (hasAdmins) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This system has administrators. Contact an admin to get admin privileges.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-6 border-primary">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>First-Time Setup</CardTitle>
        </div>
        <CardDescription>
          No administrators exist yet. As the first user, you can claim admin privileges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={becomeAdmin}
          disabled={isProcessing}
          className="w-full"
        >
          <Shield className="mr-2 h-4 w-4" />
          {isProcessing ? 'Setting up...' : 'Become Admin'}
        </Button>
      </CardContent>
    </Card>
  );
};
