import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';

interface KanbanColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
  itemIds: string[];
}

export function KanbanColumn({ id, title, children, itemIds }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-72 bg-gray-100 rounded-lg p-2">
      <h3 className="font-semibold text-gray-700 px-2 py-1 mb-2">{title}</h3>
      <SortableContext
        id={id}
        items={itemIds}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="flex-1 min-h-[100px] space-y-2"
        >
          {children}
        </div>
      </SortableContext>
    </div>
  );
}
