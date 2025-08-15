import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit } from 'lucide-react';

// A placeholder type for the lead data
export type Lead = {
  id: string;
  name: string;
  value: number;
  source: string;
  email: string;
  phone: string;
  stage_id: string;
}

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
}

export function LeadCard({ lead, onEdit }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white rounded-lg shadow-sm p-3 mb-3 touch-none group"
    >
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-sm text-gray-800 flex-1 pr-2">{lead.name}</h4>
        <div {...listeners} className="cursor-grab p-1 text-gray-400 hover:text-gray-600">
          <GripVertical size={16} />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        ${lead.value.toLocaleString()} &bull; {lead.source || 'Unknown'}
      </p>
      <button
        onClick={() => onEdit(lead)}
        className="absolute top-1 right-8 p-1 rounded-full text-gray-500 bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit size={14} />
      </button>
    </div>
  );
}
