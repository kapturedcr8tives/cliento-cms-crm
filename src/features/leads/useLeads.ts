import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLeads,
  getLeadStages,
  createLead,
  updateLead,
  updateLeadStageAndPosition,
  deleteLead
} from '../../services/apiLeads';

// Hook to fetch lead stages
export function useLeadStages() {
  const {
    isLoading,
    data: stages,
    error
  } = useQuery({
    queryKey: ['leadStages'],
    queryFn: getLeadStages,
  });

  return { isLoading, stages, error };
}

// Hook to fetch leads
export function useLeads() {
  const {
    isLoading,
    data: leads,
    error
  } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
  });

  return { isLoading, leads, error };
}

// Hook to create a new lead
export function useCreateLead() {
  const queryClient = useQueryClient();
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      alert('Lead successfully created');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (err) => alert(err.message),
  });
  return { create, isCreating };
}

// Hook to update a lead's details
export function useUpdateLead() {
  const queryClient = useQueryClient();
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: updateLead,
    onSuccess: () => {
      alert('Lead successfully updated');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (err) => alert(err.message),
  });
  return { update, isUpdating };
}

// Hook to update a lead's stage and position (for D&D)
export function useUpdateLeadStage() {
    const queryClient = useQueryClient();
    const { mutate: updateStage, isPending: isUpdatingStage } = useMutation({
      mutationFn: updateLeadStageAndPosition,
      onSuccess: () => {
        // No alert here to avoid spamming during drag-and-drop
        queryClient.invalidateQueries({ queryKey: ['leads'] });
        queryClient.invalidateQueries({ queryKey: ['leadStages'] }); // In case counts are displayed on stages
      },
      onError: (err) => alert(err.message),
    });
    return { updateStage, isUpdatingStage };
  }

// Hook to delete a lead
export function useDeleteLead() {
  const queryClient = useQueryClient();
  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      alert('Lead successfully deleted');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (err) => alert(err.message),
  });
  return { remove, isDeleting };
}
