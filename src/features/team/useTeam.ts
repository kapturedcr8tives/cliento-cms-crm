import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTeamMembers,
  inviteUser,
  getInvitationDetails,
  acceptInvite,
} from '../../services/apiTeam';
import { useNavigate } from 'react-router-dom';

export function useTeamMembers() {
  return useQuery({
    queryKey: ['teamMembers'],
    queryFn: getTeamMembers,
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      alert('Invitation sent successfully!');
      // In a real app, you might not need to invalidate here,
      // but you might want to show pending invites in the list.
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
    onError: (err) => alert(err.message),
  });
}

export function useGetInvitation(token: string | null) {
    return useQuery({
        queryKey: ['invitation', token],
        queryFn: () => getInvitationDetails(token!),
        enabled: !!token,
        retry: false, // Don't retry if the token is invalid
    });
}

export function useAcceptInvite() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: acceptInvite,
        onSuccess: () => {
            alert('Welcome! Your account has been created.');
            // Sign in the user automatically and redirect to dashboard
            // The acceptInvite function should return a session, then you can sign in
            navigate('/dashboard');
        },
        onError: (err) => alert(err.message),
    });
}

// Hooks for removeMember, updateMemberRole, etc., would go here.
