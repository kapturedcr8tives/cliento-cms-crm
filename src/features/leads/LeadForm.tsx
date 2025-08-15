import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, LeadFormValues } from './validation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCreateLead, useUpdateLead, useLeadStages } from './useLeads';
import { Lead } from './LeadCard'; // A more complete type would be better

interface LeadFormProps {
  leadToEdit?: Lead;
  onCloseModal?: () => void;
}

export function LeadForm({ leadToEdit, onCloseModal }: LeadFormProps) {
  const isEditSession = Boolean(leadToEdit?.id);
  const { stages, isLoading: isLoadingStages } = useLeadStages();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: leadToEdit ? {
      name: leadToEdit.name,
      email: leadToEdit.email,
      phone: leadToEdit.phone,
      value: leadToEdit.value,
      source: leadToEdit.source,
      stage_id: leadToEdit.stage_id,
    } : {
      value: 0
    },
  });

  const { create, isCreating } = useCreateLead();
  const { update, isUpdating } = useUpdateLead();

  const isWorking = isCreating || isUpdating;

  function onSubmit(data: LeadFormValues) {
    const mutationData = { ...data, position: 0 }; // Default position, real app might need more logic

    if (isEditSession) {
      update({ id: leadToEdit!.id, ...mutationData }, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    } else {
      create(mutationData, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Lead Name</label>
        <Input id="name" {...register('name')} disabled={isWorking} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <Input id="email" type="email" {...register('email')} disabled={isWorking} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
       <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value ($)</label>
        <Input id="value" type="number" {...register('value')} disabled={isWorking} />
        {errors.value && <p className="text-sm text-red-500">{errors.value.message}</p>}
      </div>
      <div>
        <label htmlFor="stage_id" className="block text-sm font-medium text-gray-700">Stage</label>
        <select id="stage_id" {...register('stage_id')} disabled={isWorking || isLoadingStages} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          {isLoadingStages ? <option>Loading stages...</option> : stages?.map(stage => (
            <option key={stage.id} value={stage.id}>{stage.name}</option>
          ))}
        </select>
        {errors.stage_id && <p className="text-sm text-red-500">{errors.stage_id.message}</p>}
      </div>
      {/* Add phone and source fields if needed */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" onClick={onCloseModal} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
          Cancel
        </Button>
        <Button type="submit" disabled={isWorking}>
          {isWorking ? 'Saving...' : (isEditSession ? 'Save Changes' : 'Create Lead')}
        </Button>
      </div>
    </form>
  );
}
