import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, TaskFormValues } from './validation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCreateTask, useUpdateTask, useProject } from './useProjects';

// A more complete type would be better
type Task = { id: string, [key: string]: any };

interface TaskFormProps {
  taskToEdit?: Task;
  onCloseModal?: () => void;
  projectId: string;
  defaultStageId?: string;
}

export function TaskForm({ taskToEdit, onCloseModal, projectId, defaultStageId }: TaskFormProps) {
  const isEditSession = Boolean(taskToEdit?.id);
  const { data: project, isLoading: isLoadingProject } = useProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: taskToEdit || { priority: 'medium', stage_id: defaultStageId },
  });

  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

  const isWorking = isCreating || isUpdating;

  function onSubmit(data: TaskFormValues) {
    const mutationData = { ...data, project_id: projectId, position: 0 };

    if (isEditSession) {
      updateTask({ id: taskToEdit!.id, ...mutationData }, {
        onSuccess: () => { reset(); onCloseModal?.(); },
      });
    } else {
      createTask(mutationData, {
        onSuccess: () => { reset(); onCloseModal?.(); },
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title">Task Title</label>
        <Input id="title" {...register('title')} disabled={isWorking} />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" {...register('description')} disabled={isWorking} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
      </div>
      <div>
        <label htmlFor="stage_id">Stage</label>
        <select id="stage_id" {...register('stage_id')} disabled={isWorking || isLoadingProject} className="w-full px-3 py-2 border border-gray-300 rounded-md">
            {project?.project_stages?.map(stage => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="priority">Priority</label>
        <select id="priority" {...register('priority')} disabled={isWorking} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" onClick={onCloseModal} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
        <Button type="submit" disabled={isWorking}>{isWorking ? 'Saving...' : 'Save Task'}</Button>
      </div>
    </form>
  );
}
