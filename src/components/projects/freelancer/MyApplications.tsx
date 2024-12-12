import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectApplication } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/ui/icons';
import { formatCurrency, formatDate } from '@/lib/utils';
import { applicationApi } from '@/services/api/application';

export function MyApplications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const data = await applicationApi.getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applications',
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

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>My Applications</h1>

      {applications.length === 0 ? (
        <div className='text-center py-12'>
          <Icons.inbox className='mx-auto h-12 w-12 text-muted-foreground/50' />
          <h3 className='mt-4 text-sm font-semibold text-muted-foreground'>No applications yet</h3>
          <p className='mt-2 text-sm text-muted-foreground'>Start applying to projects to see your applications here.</p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {applications.map((application) => (
            <div
              key={application.id}
              className='border rounded-lg p-4 hover:bg-muted/50 cursor-pointer'
              onClick={() => navigate(`/projects/${application.projectId}`)}
            >
              <div className='flex justify-between items-start'>
                <div className='space-y-1'>
                  <h3 className='font-semibold'>{application.Project.title}</h3>
                  <p className='text-sm text-muted-foreground'>Applied: {formatDate(application.createdAt)}</p>
                  <p className='text-sm'>Proposed Rate: {formatCurrency(application.proposedRate)}/hr</p>
                </div>
                <span className='inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium capitalize'>
                  {application.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
