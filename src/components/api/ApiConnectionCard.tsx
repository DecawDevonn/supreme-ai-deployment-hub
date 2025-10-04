import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ApiConnectionsService, ApiConnection } from '@/services/api/apiConnectionsService';
import { Trash2, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApiConnectionCardProps {
  connection: ApiConnection;
  onUpdate: () => void;
}

const ApiConnectionCard: React.FC<ApiConnectionCardProps> = ({ connection, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await ApiConnectionsService.deleteConnection(connection.id);
      toast({
        title: 'Connection Deleted',
        description: `${connection.service_name} connection has been removed.`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete connection. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const isValid = await ApiConnectionsService.validateConnection(connection.id);
      toast({
        title: isValid ? 'Connection Valid' : 'Connection Invalid',
        description: isValid 
          ? `${connection.service_name} credentials are working correctly.`
          : `${connection.service_name} credentials could not be verified.`,
        variant: isValid ? 'default' : 'destructive',
      });
      onUpdate();
    } catch (error) {
      console.error('Error validating connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to validate connection. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{connection.service_name}</CardTitle>
          <Badge variant={connection.is_valid ? 'default' : 'destructive'}>
            {connection.is_valid ? (
              <><CheckCircle className="mr-1 h-3 w-3" /> Valid</>
            ) : (
              <><XCircle className="mr-1 h-3 w-3" /> Invalid</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Auth Type:</span> {connection.auth_type.replace('_', ' ').toUpperCase()}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Last Validated:</span>{' '}
          {connection.last_validated_at 
            ? formatDistanceToNow(new Date(connection.last_validated_at), { addSuffix: true })
            : 'Never'}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Created:</span>{' '}
          {formatDistanceToNow(new Date(connection.created_at), { addSuffix: true })}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleValidate}
          disabled={isValidating || isDeleting}
        >
          {isValidating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Validate
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting || isValidating}
        >
          {isDeleting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiConnectionCard;
