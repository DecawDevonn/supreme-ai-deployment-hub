import React, { useMemo } from 'react';
import { ReactFlow, Node, Edge, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkflowVisualizationProps {
  workflow: {
    nodes: any[];
    connections: any;
  };
}

const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = ({ workflow }) => {
  const { nodes, edges } = useMemo(() => {
    const flowNodes: Node[] = (workflow.nodes || []).map((node, index) => ({
      id: node.name || `node-${index}`,
      type: 'default',
      position: node.position || { x: index * 250, y: 100 },
      data: {
        label: (
          <div className="px-2 py-1">
            <div className="font-semibold text-sm">{node.name || 'Node'}</div>
            <div className="text-xs text-muted-foreground">{node.type?.split('.').pop() || 'Unknown'}</div>
          </div>
        ),
      },
      style: {
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        padding: '4px',
      },
    }));

    const flowEdges: Edge[] = [];
    const connections = workflow.connections || {};

    Object.entries(connections).forEach(([sourceNode, outputs]: [string, any]) => {
      if (outputs.main && Array.isArray(outputs.main)) {
        outputs.main.forEach((outputArray: any[], outputIndex: number) => {
          if (Array.isArray(outputArray)) {
            outputArray.forEach((connection: any) => {
              if (connection.node) {
                flowEdges.push({
                  id: `${sourceNode}-${connection.node}-${outputIndex}`,
                  source: sourceNode,
                  target: connection.node,
                  type: 'smoothstep',
                  animated: true,
                  style: { stroke: 'hsl(var(--primary))' },
                });
              }
            });
          }
        });
      }
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [workflow]);

  if (!workflow.nodes || workflow.nodes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No workflow to visualize</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 rounded-lg border bg-muted/20">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowVisualization;
