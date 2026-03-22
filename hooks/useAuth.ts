// tomato-classification-frontend/hooks/useAuth.ts
import { useAuthContext } from '@/context/AuthContext';
export const useAuth = () => {
  const { user, isLoading, login, logout, isAuthenticated } = useAuthContext();
  return { user, isLoading, login, logout, isAuthenticated };
};