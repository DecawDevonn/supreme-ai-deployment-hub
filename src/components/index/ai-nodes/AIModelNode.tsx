import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Brain, Sparkles } from 'lucide-react';

interface AIModelNodeProps {
  data: {
    label: string;
    model: string;
    status?: 'active' | 'idle';
  };
}

const AIModelNode = memo(({ data }: AIModelNodeProps) => {
  const isActive = data.status === 'active';
  
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-card transition-all duration-300 min-w-[180px] ${
      isActive 
        ? 'border-primary shadow-primary/50 scale-105' 
        : 'border-border hover:border-primary/50 hover:shadow-xl'
    }`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-primary" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
          <Brain className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs text-muted-foreground">{data.model}</div>
        </div>
        {isActive && (
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        )}
      </div>
      
      {isActive && (
        <div className="mt-2 pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">Processing...</div>
          <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse w-3/4" />
          </div>
        </div>
      )}
      
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-primary" />
    </div>
  );
});

AIModelNode.displayName = 'AIModelNode';

export default AIModelNode;
