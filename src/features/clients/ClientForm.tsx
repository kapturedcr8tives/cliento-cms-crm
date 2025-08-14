import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, ClientFormValues } from './validation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useCreateClient, useUpdateClient } from './useClients';
import { Client } from './columns';

interface ClientFormProps {
  clientToEdit?: Client;
  onCloseModal?: () => void;
}

export function ClientForm({ clientToEdit, onCloseModal }: ClientFormProps) {
  const isEditSession = Boolean(clientToEdit?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: clientToEdit ? {
      name: clientToEdit.name,
      email: clientToEdit.email,
      phone: clientToEdit.phone,
      address: clientToEdit.address,
      status: clientToEdit.status,
    } : {},
  });

  const { create, isCreating } = useCreateClient();
  const { update, isUpdating } = useUpdateClient();

  const isWorking = isCreating || isUpdating;

  function onSubmit(data: ClientFormValues) {
    if (isEditSession) {
      update({ id: clientToEdit!.id, ...data }, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    } else {
      create(data, {
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <Input id="name" {...register('name')} disabled={isWorking} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <Input id="email" type="email" {...register('email')} disabled={isWorking} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <Input id="phone" {...register('phone')} disabled={isWorking} />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <Input id="address" {...register('address')} disabled={isWorking} />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select id="status" {...register('status')} disabled={isWorking} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onCloseModal} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
          Cancel
        </Button>
        <Button type="submit" disabled={isWorking}>
          {isWorking ? 'Saving...' : (isEditSession ? 'Save Changes' : 'Create Client')}
        </Button>
      </div>
    </form>
  );
}
