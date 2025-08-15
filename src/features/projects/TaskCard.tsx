import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit } from 'lucide-react';

// Placeholder type for task data
export type Task = {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  profiles: { full_name: string } | null; // assigned_to
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white rounded-md shadow-sm p-3 mb-2 touch-none group border-l-4 ${priorityColors[task.priority]}`}
    >
      <div className="flex justify-between items-start">
        <p className="font-semibold text-sm text-gray-800 flex-1 pr-2">{task.title}</p>
        <div {...listeners} className="cursor-grab p-1 text-gray-400 hover:text-gray-600">
          <GripVertical size={16} />
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-500">
          {task.profiles?.full_name || 'Unassigned'}
        </p>
        <button
          onClick={() => onEdit(task)}
          className="p-1 rounded-full text-gray-500 bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit size={14} />
        </button>
      </div>
    </div>
  );
}
