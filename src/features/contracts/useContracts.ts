import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getContracts,
  getContract,
  createContract,
  updateContract,
  deleteContract
} from '../../services/apiContracts';
import { useParams } from 'react-router-dom';

export function useContracts() {
  return useQuery({ queryKey: ['contracts'], queryFn: getContracts });
}

export function useContract() {
  const { contractId } = useParams();
  return useQuery({
    queryKey: ['contract', contractId],
    queryFn: () => getContract(contractId!),
    enabled: !!contractId,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      alert('Contract created');
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
    onError: (err) => alert(err.message),
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  const { contractId } = useParams();
  return useMutation({
    mutationFn: updateContract,
    onSuccess: () => {
      alert('Contract updated');
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] });
    },
    onError: (err) => alert(err.message),
  });
}

export function useDeleteContract() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteContract,
      onSuccess: () => {
        alert('Contract deleted');
        queryClient.invalidateQueries({ queryKey: ['contracts'] });
      },
      onError: (err) => alert(err.message),
    });
  }
