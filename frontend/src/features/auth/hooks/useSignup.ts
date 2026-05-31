import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { signup } from '../api/authApi';
import { authKeys } from '../queryKeys';
import type { LoginCredentials } from '../types';

export function useSignup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: '/signup' });

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => signup(credentials),
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session(), session);
      void navigate({ to: '/formation', search: { redirect, change: false } });
    },
  });
}
