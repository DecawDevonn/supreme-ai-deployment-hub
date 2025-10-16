import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database, TrendingUp } from 'lucide-react';

interface DataProcessorNodeProps {
  data: {
    label: string;
    type: string;
    status?: 'active' | 'idle';
  };
}

const DataProcessorNode = memo(({ data }: DataProcessorNodeProps) => {
  const isActive = data.status === 'active';
  
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-card transition-all duration-300 min-w-[180px] ${
      isActive 
        ? 'border-accent shadow-accent/50 scale-105' 
        : 'border-border hover:border-accent/50 hover:shadow-xl'
    }`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-accent" />
      
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-accent/20' : 'bg-muted'}`}>
          <Database className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-muted-foreground'}`} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs text-muted-foreground">{data.type}</div>
        </div>
        {isActive && (
          <TrendingUp className="w-4 h-4 text-accent animate-pulse" />
        )}
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-accent" />
    </div>
  );
});

DataProcessorNode.displayName = 'DataProcessorNode';

export default DataProcessorNode;
