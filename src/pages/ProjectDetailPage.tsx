import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProject, useUpdateTaskStage } from '../features/projects/useProjects';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { KanbanColumn } from '../components/kanban/KanbanColumn';
import { TaskCard, Task } from '../features/projects/TaskCard';
import { DragEndEvent } from '@dnd-kit/core';
import { Button } from '../components/ui/Button';
import { PlusCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../features/projects/TaskForm';

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const { data: project, isLoading, error } = useProject();
  const { updateStage } = useUpdateTaskStage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  const tasksByStage = useMemo(() => {
    if (!project?.project_stages) return {};
    const stagesMap = project.project_stages.reduce((acc, stage) => ({ ...acc, [stage.id]: [] }), {});
    project.project_stages.forEach(stage => {
        stage.tasks.forEach(task => { if (stagesMap[stage.id]) stagesMap[stage.id].push(task); });
    });
    return stagesMap;
  }, [project]);

  const handleOpenModal = () => { setTaskToEdit(undefined); setIsModalOpen(true); };
  const handleEditTask = (task: Task) => { setTaskToEdit(task); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setTaskToEdit(undefined); };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as string;
    let originalStageId = '';
    project?.project_stages.forEach(s => { if(s.tasks.some(t => t.id === taskId)) originalStageId = s.id; });
    const newStageId = project.project_stages.find(s => s.id === over.id) ? over.id as string : project.project_stages.find(s => s.tasks.some(t => t.id === over.id))?.id || '';
    if (!newStageId || newStageId === originalStageId) return;
    updateStage({ taskId, stageId: newStageId, position: 0 });
  }

  if (isLoading) return <p>Loading project...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
        <p className="text-lg text-gray-600 mt-1">Client: {project.clients?.name || 'N/A'}</p>
        <p className="text-sm text-gray-500 mt-2">{project.description}</p>
      </div>

      <div className="flex items-center justify-end mb-4 space-x-4">
        <Button onClick={handleOpenModal}>
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Task
        </Button>
      </div>

      <KanbanBoard onDragEnd={handleDragEnd}>
        {project.project_stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            id={stage.id}
            title={`${stage.name} (${tasksByStage[stage.id]?.length || 0})`}
            itemIds={tasksByStage[stage.id]?.map(t => t.id) || []}
          >
            {tasksByStage[stage.id]?.map((task: any) => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
            ))}
          </KanbanColumn>
        ))}
      </KanbanBoard>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={taskToEdit ? 'Edit Task' : 'Create New Task'}>
        <TaskForm
            taskToEdit={taskToEdit}
            onCloseModal={handleCloseModal}
            projectId={projectId!}
            defaultStageId={project.project_stages[0]?.id}
        />
      </Modal>
    </div>
  );
}
