import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { CreateProject } from '@/components/projects/client/CreateProject';
import { ProjectList } from '@/components/projects/freelancer/ProjectList';
import { ProjectDetails } from '@/components/projects/shared/ProjectDetails';
import { ManageProjects } from '@/components/projects/client/ManageProjects';
import { ProjectApplication } from '@/components/projects/freelancer/ProjectApplication';
import { MyApplications } from '@/components/projects/freelancer/MyApplications';

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
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

      {/* Protected Dashboard Routes */}
      <Route
        path='/dashboard'
        element={
          <AuthGuard requireAuth>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </AuthGuard>
        }
      />

      <Route
        path='/profile'
        element={
          <AuthGuard requireAuth>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </AuthGuard>
        }
      />

      {/* Project Routes */}
      <Route path='/projects'>
        <Route
          index
          element={
            <AuthGuard requireAuth allowedRoles={['freelancer']}>
              <DashboardLayout>
                <ProjectList />
              </DashboardLayout>
            </AuthGuard>
          }
        />

        <Route
          path='create'
          element={
            <AuthGuard requireAuth allowedRoles={['client']}>
              <DashboardLayout>
                <CreateProject />
              </DashboardLayout>
            </AuthGuard>
          }
        />

        <Route
          path=':id'
          element={
            <AuthGuard requireAuth>
              <DashboardLayout>
                <ProjectDetails />
              </DashboardLayout>
            </AuthGuard>
          }
        />

        <Route
          path='manage'
          element={
            <AuthGuard requireAuth allowedRoles={['client']}>
              <DashboardLayout>
                <ManageProjects />
              </DashboardLayout>
            </AuthGuard>
          }
        />

        <Route
          path='applications'
          element={
            <AuthGuard requireAuth allowedRoles={['freelancer']}>
              <DashboardLayout>
                <MyApplications />
              </DashboardLayout>
            </AuthGuard>
          }
        />

        <Route
          path=':id/apply'
          element={
            <AuthGuard requireAuth allowedRoles={['freelancer']}>
              <DashboardLayout>
                <ProjectApplication />
              </DashboardLayout>
            </AuthGuard>
          }
        />
      </Route>

      {/* Default Route */}
      <Route path='/' element={<Navigate to='/dashboard' replace />} />
    </Routes>
  );
}
