import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Download, CheckCircle2 } from 'lucide-react';

interface OutputNodeProps {
  data: {
    label: string;
    destination: string;
    status?: 'complete' | 'pending';
  };
}

const OutputNode = memo(({ data }: OutputNodeProps) => {
  const isComplete = data.status === 'complete';
  
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-card transition-all duration-300 min-w-[160px] ${
      isComplete 
        ? 'border-green-500 shadow-green-500/50' 
        : 'border-border hover:border-primary/50 hover:shadow-xl'
    }`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-primary" />
      
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${isComplete ? 'bg-green-500/20' : 'bg-muted'}`}>
          {isComplete ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <Download className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs text-muted-foreground">{data.destination}</div>
        </div>
      </div>
    </div>
  );
});

OutputNode.displayName = 'OutputNode';

export default OutputNode;
