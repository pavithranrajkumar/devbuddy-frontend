import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectApi } from '@/services/api/project';
import { Project, ProjectApplication } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/contexts/AuthContext';
import { ApplicationList } from '../client/ApplicationList';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [application, setApplication] = useState<ProjectApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isClient = user?.userType === 'client';
  const isFreelancer = user?.userType === 'freelancer';

  useEffect(() => {
    if (id) {
      loadProjectData(Number(id));
    }
  }, [id]);

  const loadProjectData = async (projectId: number) => {
    try {
      setIsLoading(true);
      const [projectData, applicationData] = await Promise.all([
        projectApi.getProject(projectId),
        isFreelancer ? projectApi.getFreelancerApplication(projectId) : null,
      ]);
      setProject(projectData);
      setApplication(applicationData);
    } catch (error) {
      console.error('Error loading project:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Icons.spinner className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (!project) {
    return (
      <div className='text-center py-12'>
        <Icons.alertCircle className='mx-auto h-12 w-12 text-muted-foreground/50' />
        <h3 className='mt-4 text-sm font-semibold text-muted-foreground'>Project not found</h3>
        <p className='mt-2 text-sm text-muted-foreground'>The project you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>{project.title}</h1>

        <div className='flex justify-between items-center'>
          <div className='space-y-1'>
            <p className='text-lg font-medium'>
              Budget: {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
            </p>
            <p className='text-sm text-muted-foreground'>Deadline: {formatDate(project.deadline)}</p>
          </div>

          {isFreelancer && !application && <Button onClick={() => navigate(`/projects/${project.id}/apply`)}>Apply Now</Button>}
        </div>

        <div className='prose max-w-none'>
          <h2 className='text-xl font-semibold'>Project Description</h2>
          <p className='whitespace-pre-wrap'>{project.description}</p>
        </div>

        {isFreelancer && application && (
          <div className='border rounded-lg p-4 bg-muted/50'>
            <h2 className='text-xl font-semibold mb-4'>Your Application</h2>
            <div className='space-y-2'>
              <p>
                Status: <span className='font-medium capitalize'>{application.status}</span>
              </p>
              <p>Proposed Rate: {formatCurrency(application.proposedRate)}/hr</p>
              <p>Estimated Duration: {application.estimatedDuration} days</p>
            </div>
          </div>
        )}

        {isClient && (
          <div className='border rounded-lg p-6 bg-card'>
            <h2 className='text-xl font-semibold mb-4'>Applications</h2>
            <ApplicationList projectId={project.id} />
          </div>
        )}
      </div>
    </div>
  );
}
