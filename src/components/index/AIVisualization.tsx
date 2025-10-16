import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AIModelNode, DataProcessorNode, InputNode, OutputNode } from './ai-nodes';

const nodeTypes = {
  aiModel: AIModelNode,
  dataProcessor: DataProcessorNode,
  input: InputNode,
  output: OutputNode,
};

const initialNodes: Node[] = [
  {
    id: 'input-1',
    type: 'input',
    position: { x: 50, y: 150 },
    data: { label: 'Data Source', source: 'API/Database' },
  },
  {
    id: 'processor-1',
    type: 'dataProcessor',
    position: { x: 300, y: 50 },
    data: { label: 'Preprocessor', type: 'Data Cleaning', status: 'active' },
  },
  {
    id: 'ai-1',
    type: 'aiModel',
    position: { x: 550, y: 150 },
    data: { label: 'GPT-5', model: 'Language Model', status: 'active' },
  },
  {
    id: 'processor-2',
    type: 'dataProcessor',
    position: { x: 300, y: 250 },
    data: { label: 'Embedding', type: 'Vector DB', status: 'idle' },
  },
  {
    id: 'ai-2',
    type: 'aiModel',
    position: { x: 550, y: 350 },
    data: { label: 'Gemini 2.5', model: 'Multimodal', status: 'idle' },
  },
  {
    id: 'output-1',
    type: 'output',
    position: { x: 850, y: 150 },
    data: { label: 'Response', destination: 'User Interface', status: 'complete' },
  },
  {
    id: 'output-2',
    type: 'output',
    position: { x: 850, y: 350 },
    data: { label: 'Analytics', destination: 'Dashboard', status: 'pending' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'input-1',
    target: 'processor-1',
    animated: true,
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
  },
  {
    id: 'e1-3',
    source: 'input-1',
    target: 'processor-2',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 },
  },
  {
    id: 'e2-4',
    source: 'processor-1',
    target: 'ai-1',
    animated: true,
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
  },
  {
    id: 'e3-5',
    source: 'processor-2',
    target: 'ai-2',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 2 },
  },
  {
    id: 'e4-6',
    source: 'ai-1',
    target: 'output-1',
    animated: true,
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
  },
  {
    id: 'e5-7',
    source: 'ai-2',
    target: 'output-2',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--accent))', strokeWidth: 2 },
  },
  {
    id: 'e4-7',
    source: 'ai-1',
    target: 'output-2',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '5,5' },
  },
];

const AIVisualization: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Simulate processing flow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNodeIndex((prev) => (prev + 1) % 3);
      
      setNodes((nds) =>
        nds.map((node) => {
          if (node.type === 'aiModel' || node.type === 'dataProcessor') {
            const shouldBeActive = 
              (activeNodeIndex === 0 && (node.id === 'processor-1' || node.id === 'ai-1')) ||
              (activeNodeIndex === 1 && (node.id === 'processor-2' || node.id === 'ai-2')) ||
              (activeNodeIndex === 2 && node.id === 'processor-1');
            
            return {
              ...node,
              data: {
                ...node.data,
                status: shouldBeActive ? 'active' : 'idle',
              },
            };
          }
          return node;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [activeNodeIndex, setNodes]);
  
  return (
    <section className="py-20">
      <Container maxWidth="2xl">
        <SectionHeading
          centered
          animate
          tag="Interactive Demo"
          subheading="Drag nodes, create connections, and explore AI workflow architecture"
        >
          Interactive AI Workflow
        </SectionHeading>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 rounded-xl overflow-hidden shadow-lg border border-border"
        >
          <div className="bg-gradient-to-br from-background to-muted/20 p-2 md:p-4 rounded-xl">
            <div className="h-[500px] w-full rounded-lg bg-background border border-border overflow-hidden">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.5}
                maxZoom={1.5}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              >
                <Background 
                  variant={BackgroundVariant.Dots} 
                  gap={12} 
                  size={1} 
                  className="bg-muted/20"
                />
                <Controls className="bg-card border border-border rounded-lg shadow-lg" />
              </ReactFlow>
            </div>
          </div>
          
          <div className="bg-card p-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Interactive AI Deployment:</strong> Drag nodes to reposition, click connections to edit flow paths. 
              Watch real-time data processing through interconnected AI models and data processors.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default AIVisualization;
