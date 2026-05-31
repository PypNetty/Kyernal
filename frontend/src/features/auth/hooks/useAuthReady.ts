import { isAuthReady } from '../lib/authReady';
import { useAuth } from './useAuth';

export function useAuthReady() {
  const auth = useAuth();
  return {
    ...auth,
    isAuthReady: isAuthReady(auth.data),
  };
}
