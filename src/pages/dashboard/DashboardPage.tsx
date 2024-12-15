import { useAuth } from '@/contexts/AuthContext';
import { ClientDashboard } from './ClientDashboard';
import { FreelancerDashboard } from './FreelancerDashboard';

export function DashboardPage() {
  const { user } = useAuth();

  return user?.userType === 'client' ? <ClientDashboard user={user} /> : <FreelancerDashboard />;
}
