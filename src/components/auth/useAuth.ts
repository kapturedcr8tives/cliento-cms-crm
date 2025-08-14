import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signOut } from '../../services/apiAuth';

export function useSignup() {
  const navigate = useNavigate();
  const { mutate: signup, isPending: isSigningUp } = useMutation({
    mutationFn: signUp,
    onSuccess: (user) => {
      console.log('Signup successful:', user);
      // In a real app, you might show a success toast/notification
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      console.error('ERROR', err);
      // In a real app, you would show an error toast/notification
      alert(`Signup failed: ${err.message}`);
    },
  });

  return { signup, isSigningUp };
}

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: signIn,
    onSuccess: (user) => {
      console.log('Login successful:', user);
      // You might want to pre-fetch user-specific data here
      // queryClient.setQueryData(['user'], user.user);
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      console.error('ERROR', err);
      alert(`Login failed: ${err.message}`);
    },
  });

  return { login, isLoggingIn };
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // Remove all queries from the cache on logout
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });

  return { logout, isLoggingOut };
}
