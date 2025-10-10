import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Workflow, WorkflowNode } from '@/types/workflow';
import { Play, Save, Settings, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DndContext, DragEndEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/components/ui/sortable-item';
import { DraggableItem } from '@/components/ui/draggable-item';
import { DroppableArea } from '@/components/ui/droppable-area';

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave?: (workflow: Workflow) => void;
  onExecute?: (workflow: Workflow) => void;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow,
  onSave,
  onExecute
}) => {
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>(
    workflow || {
      id: '',
      name: 'New Workflow',
      active: false,
      nodes: [],
      connections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'custom'
    }
  );

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const nodeTypes = [
    { type: 'webhook', name: 'Webhook', icon: '🔗', category: 'trigger' },
    { type: 'http', name: 'HTTP Request', icon: '🌐', category: 'action' },
    { type: 'openai', name: 'OpenAI', icon: '🤖', category: 'ai' },
    { type: 'slack', name: 'Slack', icon: '💬', category: 'communication' },
    { type: 'email', name: 'Email', icon: '📧', category: 'communication' },
    { type: 'kubernetes', name: 'Kubernetes', icon: '⚡', category: 'deployment' },
    { type: 'docker', name: 'Docker', icon: '🐳', category: 'deployment' },
    { type: 'aws', name: 'AWS', icon: '☁️', category: 'cloud' },
    { type: 'condition', name: 'Condition', icon: '🔀', category: 'logic' },
    { type: 'transform', name: 'Transform', icon: '🔄', category: 'data' }
  ];

  const addNode = useCallback((type: string) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      name: nodeTypes.find(nt => nt.type === type)?.name || type,
      parameters: {},
      position: { 
        x: 100 + (currentWorkflow.nodes.length * 200), 
        y: 100 + (Math.floor(currentWorkflow.nodes.length / 4) * 150) 
      }
    };

    setCurrentWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: new Date().toISOString()
    }));

    toast.success(`Added ${newNode.name} node`);
  }, [currentWorkflow.nodes.length, nodeTypes]);

  const removeNode = useCallback((nodeId: string) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      connections: prev.connections.filter(c => c.source !== nodeId && c.target !== nodeId),
      updatedAt: new Date().toISOString()
    }));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }

    toast.success('Node removed');
  }, [selectedNode]);

  const handleSave = useCallback(() => {
    const updatedWorkflow = {
      ...currentWorkflow,
      updatedAt: new Date().toISOString()
    };
    
    setCurrentWorkflow(updatedWorkflow);
    onSave?.(updatedWorkflow);
    toast.success('Workflow saved');
  }, [currentWorkflow, onSave]);

  const handleExecute = useCallback(() => {
    if (currentWorkflow.nodes.length === 0) {
      toast.error('Add nodes to execute workflow');
      return;
    }
    
    onExecute?.(currentWorkflow);
    toast.success('Workflow execution started');
  }, [currentWorkflow, onExecute]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle dragging from palette to canvas
    if (active.data.current?.type === 'palette-node' && over.id === 'canvas') {
      addNode(active.data.current.nodeType);
      return;
    }

    // Handle reordering nodes in canvas
    if (active.id !== over.id && active.data.current?.type === 'canvas-node') {
      setCurrentWorkflow(prev => {
        const oldIndex = prev.nodes.findIndex(node => node.id === active.id);
        const newIndex = prev.nodes.findIndex(node => node.id === over.id);
        
        return {
          ...prev,
          nodes: arrayMove(prev.nodes, oldIndex, newIndex),
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Node Palette */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Node Palette</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['trigger', 'action', 'ai', 'communication', 'deployment', 'cloud', 'logic', 'data'].map(category => (
              <div key={category}>
                <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">
                  {category}
                </h4>
                <div className="space-y-1">
                  {nodeTypes
                    .filter(node => node.category === category)
                    .map(node => (
                      <DraggableItem
                        key={node.type}
                        id={`palette-${node.type}`}
                        data={{ type: 'palette-node', nodeType: node.type }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-8 cursor-grab active:cursor-grabbing"
                          onClick={() => addNode(node.type)}
                        >
                          <span className="mr-2">{node.icon}</span>
                          {node.name}
                        </Button>
                      </DraggableItem>
                    ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Workflow Canvas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-sm">{currentWorkflow.name}</CardTitle>
                <Badge variant={currentWorkflow.active ? 'default' : 'secondary'}>
                  {currentWorkflow.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" onClick={handleExecute}>
                  <Play className="h-4 w-4 mr-1" />
                  Execute
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DroppableArea id="canvas" className="border-2 border-dashed border-muted rounded-lg min-h-96 p-4 relative overflow-auto transition-all">
              {currentWorkflow.nodes.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2" />
                    <p>Drag nodes from the palette or click to add</p>
                  </div>
                </div>
              ) : (
                <SortableContext
                  items={currentWorkflow.nodes.map(n => n.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {currentWorkflow.nodes.map((node, index) => (
                      <SortableItem key={node.id} id={node.id} className="group">
                        <div className="flex items-center space-x-2">
                          <div 
                            className={`border rounded-lg p-3 cursor-pointer transition-colors flex-1 ${
                              selectedNode?.id === node.id 
                                ? 'border-primary bg-primary/5' 
                                : 'border-muted hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedNode(node)}
                            data-type="canvas-node"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {nodeTypes.find(nt => nt.type === node.type)?.icon}
                              </span>
                              <div>
                                <h4 className="font-medium text-sm">{node.name}</h4>
                                <p className="text-xs text-muted-foreground">{node.type}</p>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeNode(node.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {index < currentWorkflow.nodes.length - 1 && (
                            <div className="w-8 h-px bg-muted-foreground/30" />
                          )}
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              )}
            </DroppableArea>
          </CardContent>
        </Card>

        {/* Node Properties */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Node Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Node Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {nodeTypes.find(nt => nt.type === selectedNode.type)?.icon}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{selectedNode.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedNode.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Configuration</h4>
                  <div className="text-xs text-muted-foreground">
                    <p>Node configuration options will be available here based on the selected node type.</p>
                    <p className="mt-2">Common settings:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Name and description</li>
                      <li>Input parameters</li>
                      <li>Output settings</li>
                      <li>Error handling</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Settings className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Select a node to view its properties</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="border rounded-lg p-3 bg-background shadow-lg">
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {nodeTypes.find(nt => `palette-${nt.type}` === activeId)?.icon}
              </span>
              <div>
                <h4 className="font-medium text-sm">
                  {nodeTypes.find(nt => `palette-${nt.type}` === activeId)?.name}
                </h4>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WorkflowBuilder;