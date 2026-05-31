import { useQuery } from '@tanstack/react-query';
import { getSession } from '../api/authApi';
import { authKeys } from '../queryKeys';

export function useAuth() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: () => getSession(),
    staleTime: 0,
  });
}
