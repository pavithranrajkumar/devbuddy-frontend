import { ApplicationTimeline } from '@/components/dashboard/ApplicationTimeline';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ProjectsGrid } from '@/components/dashboard/ProjectsGrid';
import { ProfileHero } from '@/components/dashboard/ProfileHero';
import { SkillsCard } from '@/components/dashboard/SkillsCard';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { useFreelancerDashboard } from '@/hooks/useFreelancerDashboard';
import { LoadingDashboard } from '@/components/dashboard/LoadingDashboard';

export function FreelancerDashboard() {
  const { data, isLoading, error } = useFreelancerDashboard();

  if (isLoading) {
    return <LoadingDashboard />;
  }

  if (error) {
    return (
      <div className='flex h-[200px] items-center justify-center rounded-md border border-dashed'>
        <p className='text-sm text-muted-foreground'>Failed to load dashboard data</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <DashboardShell>
      {/* Hero Section with Profile Overview */}
      <ProfileHero data={data.profileOverview} />

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <StatsOverview className='md:col-span-2 lg:col-span-1' stats={data.applicationStats} />
        <SkillsCard className='md:col-span-2 lg:col-span-1' skills={data.skills} />
        <ApplicationTimeline className='md:col-span-2 lg:col-span-1' applications={data.recentApplications} />
      </div>

      {/* Projects Section */}
      <ProjectsGrid projects={data.matchingProjects} />
    </DashboardShell>
  );
}
