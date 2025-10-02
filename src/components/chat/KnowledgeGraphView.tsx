import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Network, GitBranch } from 'lucide-react';
import { KGEntity, KGRelationship } from '@/services/chat/devonnChatService';

interface KnowledgeGraphViewProps {
  entities: KGEntity[];
  relationships: KGRelationship[];
}

export const KnowledgeGraphView = ({ entities, relationships }: KnowledgeGraphViewProps) => {
  const entityTypeColors: Record<string, string> = {
    Service: 'bg-blue-500',
    Deployment: 'bg-green-500',
    Issue: 'bg-red-500',
    Person: 'bg-purple-500',
    Tool: 'bg-orange-500',
    Workflow: 'bg-pink-500',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          Knowledge Graph
        </CardTitle>
        <CardDescription>
          Extracted entities and relationships from conversation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Entities */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Entities ({entities.length})
            </h4>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {entities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No entities extracted yet
                  </p>
                ) : (
                  entities.map((entity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          entityTypeColors[entity.type] || 'bg-gray-500'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{entity.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {entity.type}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Relationships */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Relationships ({relationships.length})
            </h4>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {relationships.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No relationships extracted yet
                  </p>
                ) : (
                  relationships.map((rel, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-primary">{rel.from}</span>
                        <Badge variant="secondary" className="text-xs">
                          {rel.type}
                        </Badge>
                        <span className="font-medium text-primary">{rel.to}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Summary */}
          {(entities.length > 0 || relationships.length > 0) && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{entities.length}</p>
                  <p className="text-xs text-muted-foreground">Entities</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{relationships.length}</p>
                  <p className="text-xs text-muted-foreground">Relationships</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
