import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

interface KanbanBoardProps {
  children: React.ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  // Add other event handlers as needed
}

export function KanbanBoard({ children, onDragEnd }: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 10 pixels before starting a drag
      // to avoid interfering with clicks
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={onDragEnd}
      // onDragStart, onDragOver can be added here
    >
      <div className="flex space-x-4 overflow-x-auto p-4">
        {children}
      </div>
    </DndContext>
  );
}
