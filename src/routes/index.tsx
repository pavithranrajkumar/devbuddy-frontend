import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { LoadingScreen } from '@/components/ui/loading-screen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen size='lg' />;
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path='/login'
        element={
          <AuthGuard>
            <Login />
          </AuthGuard>
        }
      />
      <Route
        path='/register'
        element={
          <AuthGuard>
            <Register />
          </AuthGuard>
        }
      />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path='/' element={<Navigate to='/dashboard' replace />} />
    </Routes>
  );
}
