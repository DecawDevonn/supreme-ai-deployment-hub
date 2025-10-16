import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Upload } from 'lucide-react';

interface InputNodeProps {
  data: {
    label: string;
    source: string;
  };
}

const InputNode = memo(({ data }: InputNodeProps) => {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 min-w-[160px]">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-muted">
          <Upload className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs text-muted-foreground">{data.source}</div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-primary" />
    </div>
  );
});

InputNode.displayName = 'InputNode';

export default InputNode;
