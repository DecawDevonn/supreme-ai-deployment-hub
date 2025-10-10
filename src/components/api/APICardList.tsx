import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import APICard from './APICard';
import { APIConfig } from '@/types/api';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/components/ui/sortable-item';

interface APICardListProps {
  apiConfigs: APIConfig[];
  testingConnection: string | null;
  onRemove: (name: string) => void;
  onTest: (name: string) => void;
}

const APICardList: React.FC<APICardListProps> = ({ 
  apiConfigs, 
  testingConnection, 
  onRemove, 
  onTest 
}) => {
  const [items, setItems] = useState(apiConfigs);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  React.useEffect(() => {
    setItems(apiConfigs);
  }, [apiConfigs]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.name === active.id);
        const newIndex = items.findIndex(item => item.name === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (apiConfigs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No API connections configured yet.</p>
        <p className="text-sm">Add an API connection to integrate external services with DEVONN.AI</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(c => c.name)} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {items.map((config) => (
            <SortableItem key={config.name} id={config.name} className="group">
              <APICard
                config={config}
                testingConnection={testingConnection}
                onRemove={onRemove}
                onTest={onTest}
              />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default APICardList;
