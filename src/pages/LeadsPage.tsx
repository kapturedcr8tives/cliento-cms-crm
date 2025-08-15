import { useMemo, useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { KanbanColumn } from '../components/kanban/KanbanColumn';
import { LeadCard, Lead } from '../features/leads/LeadCard';
import { useLeads, useLeadStages, useUpdateLeadStage } from '../features/leads/useLeads';
import { PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LeadForm } from '../features/leads/LeadForm';

type Stage = { id: string; name: string; };

export function LeadsPage() {
  const { isLoading: isLoadingStages, stages } = useLeadStages();
  const { isLoading: isLoadingLeads, leads } = useLeads();
  const { updateStage } = useUpdateLeadStage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | undefined>(undefined);

  const leadsByStage = useMemo(() => {
    if (!leads) return {};
    return leads.reduce((acc, lead) => {
      const stageId = lead.stage_id || 'unassigned';
      if (!acc[stageId]) {
        acc[stageId] = [];
      }
      acc[stageId].push(lead);
      return acc;
    }, {} as Record<string, Lead[]>);
  }, [leads]);

  function handleOpenModal() {
    setLeadToEdit(undefined);
    setIsModalOpen(true);
  }

  function handleEditLead(lead: Lead) {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setLeadToEdit(undefined);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeLead = leads?.find(l => l.id === activeId);
    const originalStageId = activeLead?.stage_id;
    const newStageId = stages?.find(s => s.id === overId) ? overId : leads?.find(l => l.id === overId)?.stage_id;
    if (!newStageId || newStageId === originalStageId) return;
    updateStage({ leadId: activeId, stageId: newStageId, position: 0 });
  }

  if (isLoadingStages || isLoadingLeads) {
    return <p>Loading sales pipeline...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Pipeline</h1>
        <Button onClick={handleOpenModal}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Lead
        </Button>
      </div>

      <KanbanBoard onDragEnd={handleDragEnd}>
        {stages?.map((stage) => (
          <KanbanColumn
            key={stage.id}
            id={stage.id}
            title={`${stage.name} (${leadsByStage[stage.id]?.length || 0})`}
            itemIds={leadsByStage[stage.id]?.map(l => l.id) || []}
          >
            {leadsByStage[stage.id]?.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onEdit={handleEditLead} />
            ))}
          </KanbanColumn>
        ))}
      </KanbanBoard>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={leadToEdit ? 'Edit Lead' : 'Create New Lead'}
      >
        <LeadForm leadToEdit={leadToEdit} onCloseModal={handleCloseModal} />
      </Modal>
    </div>
  );
}
