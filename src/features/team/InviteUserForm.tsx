import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteUserSchema, InviteUserFormValues, userRoleEnum } from './validation';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface InviteUserFormProps {
  onCloseModal?: () => void;
}

export function InviteUserForm({ onCloseModal }: InviteUserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
        role: 'TEAM_MEMBER', // Sensible default
    }
  });

  // The mutation hook will be added here in a later step
  const isWorking = false; // Placeholder

  function onSubmit(data: InviteUserFormValues) {
    console.log('Invite User Data:', data);
    // In a later step, this will call the mutation from a hook
    // e.g., inviteUser(data, { onSuccess: () => { reset(); onCloseModal?.(); } });
    alert('Form submitted! Check the console for data. (API not yet implemented)');
    reset();
    onCloseModal?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">User Email</label>
        <Input id="email" type="email" {...register('email')} disabled={isWorking} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <select id="role" {...register('role')} disabled={isWorking} className="w-full px-3 py-2 border border-gray-300 rounded-md">
          {userRoleEnum.options.map(role => (
            <option key={role} value={role}>
              {role.replace(/_/g, ' ').charAt(0).toUpperCase() + role.replace(/_/g, ' ').slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" onClick={onCloseModal} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
          Cancel
        </Button>
        <Button type="submit" disabled={isWorking}>
          {isWorking ? 'Sending Invite...' : 'Send Invite'}
        </Button>
      </div>
    </form>
  );
}
