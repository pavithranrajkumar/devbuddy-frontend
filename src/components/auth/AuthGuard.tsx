import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { LoadingScreen } from '../ui/loading-screen';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('client' | 'freelancer')[];
}

export function AuthGuard({ children, requireAuth = false, allowedRoles }: AuthGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!requireAuth && user) {
    return <Navigate to='/dashboard' replace />;
  }

  if (requireAuth && !user) {
    return <Navigate to='/login' replace />;
  }

  if (user && allowedRoles && !allowedRoles.includes(user.userType)) {
    return <Navigate to='/dashboard' replace />;
  }

  return <>{children}</>;
}
