import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, createClient, updateClient, deleteClient } from '../../services/apiClients';

export function useClients() {
  const {
    isLoading,
    data: clients,
    error
  } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  return { isLoading, clients, error };
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      alert('Client successfully created');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (err) => alert(err.message),
  });

  return { create, isCreating };
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      alert('Client successfully updated');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (err) => alert(err.message),
  });

  return { update, isUpdating };
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      alert('Client successfully deleted');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (err) => alert(err.message),
  });

  return { remove, isDeleting };
}
