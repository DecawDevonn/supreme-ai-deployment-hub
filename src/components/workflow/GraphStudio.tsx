import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkflowGraph, AGENT_ROLES } from '@/types/graph';
import { ReactFlow, Node, Edge, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface GraphStudioProps {
  graph: WorkflowGraph;
}

const GraphStudio: React.FC<GraphStudioProps> = ({ graph }) => {
  const { nodes, edges } = useMemo(() => {
    // Convert graph agents to React Flow nodes
    const nodes: Node[] = graph.agents.map((agent, index) => {
      const config = AGENT_ROLES[agent.role];
      return {
        id: agent.id,
        type: 'default',
        position: {
          x: 150 + (index % 3) * 250,
          y: 100 + Math.floor(index / 3) * 200
        },
        data: {
          label: (
            <div className="px-4 py-2">
              <div className="flex items-center gap-2 font-semibold">
                <span>{config.icon}</span>
                <span>{agent.role}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Confidence: {(agent.confidence * 100).toFixed(0)}%
              </div>
            </div>
          )
        },
        style: {
          background: config.color,
          color: 'white',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          minWidth: '180px'
        }
      };
    });

    // Convert graph edges to React Flow edges
    const edges: Edge[] = graph.edges.map((edge, index) => ({
      id: `edge-${index}`,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep',
      animated: edge.condition !== 'always',
      label: edge.condition !== 'always' ? edge.condition : '',
      style: {
        stroke: edge.condition === 'always' ? '#64748b' : '#ef4444',
        strokeWidth: 2
      },
      labelStyle: {
        fontSize: 10,
        fill: '#ef4444'
      }
    }));

    return { nodes, edges };
  }, [graph]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Multi-Agent Graph</CardTitle>
            <CardDescription>
              {graph.agents.length} agents • {graph.edges.length} connections • 
              Density: {(graph.metadata.density * 100).toFixed(0)}%
            </CardDescription>
          </div>
          <Badge variant="outline">{graph.metadata.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ height: '500px', width: '100%' }}>
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
        
        <div className="p-6 border-t">
          <h4 className="font-semibold mb-3">Agent Roles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {graph.agents.map(agent => {
              const config = AGENT_ROLES[agent.role];
              return (
                <div key={agent.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <div className="font-medium">{config.role}</div>
                    <div className="text-xs text-muted-foreground">{config.description}</div>
                    <div className="text-xs mt-1">
                      <Badge variant="secondary" style={{ backgroundColor: config.color, color: 'white' }}>
                        {(agent.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GraphStudio;
