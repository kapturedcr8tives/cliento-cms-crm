import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectFormValues } from './validation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCreateProject, useUpdateProject } from './useProjects';
import { useClients } from '../clients/useClients'; // To select a client

// A more complete type would be better
type Project = { id: string, [key: string]: any };

interface ProjectFormProps {
  projectToEdit?: Project;
  onCloseModal?: () => void;
}

export function ProjectForm({ projectToEdit, onCloseModal }: ProjectFormProps) {
  const isEditSession = Boolean(projectToEdit?.id);
  const { clients, isLoading: isLoadingClients } = useClients();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: projectToEdit || { status: 'not_started' },
  });

  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

  const isWorking = isCreating || isUpdating;

  function onSubmit(data: ProjectFormValues) {
    if (isEditSession) {
      updateProject({ id: projectToEdit!.id, ...data }, {
        onSuccess: () => { reset(); onCloseModal?.(); },
      });
    } else {
      createProject(data, {
        onSuccess: () => { reset(); onCloseModal?.(); },
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Project Name</label>
        <Input id="name" {...register('name')} disabled={isWorking} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" {...register('description')} disabled={isWorking} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
      </div>
      <div>
        <label htmlFor="client_id">Client</label>
        <select id="client_id" {...register('client_id')} disabled={isWorking || isLoadingClients} className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">No Client</option>
            {clients?.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="status">Status</label>
        <select id="status" {...register('status')} disabled={isWorking} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" onClick={onCloseModal} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
        <Button type="submit" disabled={isWorking}>{isWorking ? 'Saving...' : 'Save Project'}</Button>
      </div>
    </form>
  );
}
