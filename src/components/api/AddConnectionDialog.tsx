import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ApiConnectionsService, AuthType } from '@/services/api/apiConnectionsService';
import { Loader2 } from 'lucide-react';

interface AddConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddConnectionDialog: React.FC<AddConnectionDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const [serviceName, setServiceName] = useState('');
  const [authType, setAuthType] = useState<AuthType>('bearer_token');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAuthTypeChange = (value: AuthType) => {
    setAuthType(value);
    // Reset credentials when auth type changes
    switch (value) {
      case 'api_key':
        setCredentials({ api_key: '' });
        break;
      case 'bearer_token':
        setCredentials({ token: '' });
        break;
      case 'basic_auth':
        setCredentials({ username: '', password: '' });
        break;
      case 'oauth2':
        setCredentials({ client_id: '', client_secret: '', access_token: '' });
        break;
    }
  };

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a service name',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await ApiConnectionsService.createConnection({
        service_name: serviceName,
        auth_type: authType,
        credentials,
      });

      toast({
        title: result.validated ? 'Connection Added & Validated' : 'Connection Added',
        description: result.validated 
          ? `${serviceName} connection is valid and ready to use.`
          : `${serviceName} connection added but could not be validated. Please check your credentials.`,
        variant: result.validated ? 'default' : 'destructive',
      });

      setServiceName('');
      setCredentials({});
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error adding connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to add connection. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCredentialFields = () => {
    switch (authType) {
      case 'api_key':
        return (
          <div className="space-y-2">
            <Label htmlFor="api_key">API Key</Label>
            <Input
              id="api_key"
              type="password"
              value={credentials.api_key || ''}
              onChange={(e) => handleCredentialChange('api_key', e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
        );
      
      case 'bearer_token':
        return (
          <div className="space-y-2">
            <Label htmlFor="token">Bearer Token</Label>
            <Input
              id="token"
              type="password"
              value={credentials.token || ''}
              onChange={(e) => handleCredentialChange('token', e.target.value)}
              placeholder="Enter your bearer token"
            />
          </div>
        );
      
      case 'basic_auth':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={credentials.username || ''}
                onChange={(e) => handleCredentialChange('username', e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password || ''}
                onChange={(e) => handleCredentialChange('password', e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </>
        );
      
      case 'oauth2':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="client_id">Client ID</Label>
              <Input
                id="client_id"
                value={credentials.client_id || ''}
                onChange={(e) => handleCredentialChange('client_id', e.target.value)}
                placeholder="Enter client ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_secret">Client Secret</Label>
              <Input
                id="client_secret"
                type="password"
                value={credentials.client_secret || ''}
                onChange={(e) => handleCredentialChange('client_secret', e.target.value)}
                placeholder="Enter client secret"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access_token">Access Token</Label>
              <Input
                id="access_token"
                type="password"
                value={credentials.access_token || ''}
                onChange={(e) => handleCredentialChange('access_token', e.target.value)}
                placeholder="Enter access token"
              />
            </div>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add API Connection</DialogTitle>
          <DialogDescription>
            Connect a new external API service to use in your workflows and agents.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service_name">Service Name</Label>
            <Input
              id="service_name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g., GitHub, Slack, OpenAI"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth_type">Authentication Type</Label>
            <Select value={authType} onValueChange={handleAuthTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bearer_token">Bearer Token</SelectItem>
                <SelectItem value="api_key">API Key</SelectItem>
                <SelectItem value="basic_auth">Basic Auth</SelectItem>
                <SelectItem value="oauth2">OAuth 2.0</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderCredentialFields()}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Connection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddConnectionDialog;
