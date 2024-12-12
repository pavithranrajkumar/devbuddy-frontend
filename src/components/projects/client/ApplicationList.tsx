import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { projectApi } from '@/services/api/project';
import { ProjectApplication } from '@/types/project';
import { formatDate } from '@/lib/utils';

interface ApplicationListProps {
  projectId: number;
}

export function ApplicationList({ projectId }: ApplicationListProps) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, [projectId]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const data = await projectApi.getProjectApplications(projectId);
      console.log({ data });
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

  const handleStatusUpdate = async (applicationId: number, status: 'accepted' | 'rejected' | 'marked_for_interview') => {
    try {
      await projectApi.updateApplicationStatus(projectId, applicationId, status);
      await loadApplications();
      toast({
        title: 'Success',
        description: 'Application status updated successfully',
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-32'>
        <Icons.spinner className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className='text-center py-8'>
        <Icons.inbox className='mx-auto h-12 w-12 text-muted-foreground/50' />
        <h3 className='mt-4 text-sm font-semibold text-muted-foreground'>No applications yet</h3>
        <p className='mt-2 text-sm text-muted-foreground'>Applications will appear here once freelancers apply.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {applications.map((application) => (
        <div key={application.id} className='border rounded-lg p-4 space-y-4'>
          <div className='flex justify-between items-start'>
            <div>
              <h3 className='font-semibold'>Proposed Rate: ${application.proposedRate}/hr</h3>
              <p className='text-sm text-muted-foreground'>Estimated Duration: {application.estimatedDuration} days</p>
              <p className='text-sm text-muted-foreground'>Applied: {formatDate(application.createdAt)}</p>
            </div>
            <div className='space-x-2'>
              {application.status === 'applied' && (
                <>
                  <Button size='sm' onClick={() => handleStatusUpdate(application.id, 'marked_for_interview')}>
                    Mark for Interview
                  </Button>
                  <Button size='sm' variant='outline' onClick={() => handleStatusUpdate(application.id, 'rejected')}>
                    Reject
                  </Button>
                </>
              )}
              {application.status === 'marked_for_interview' && (
                <Button size='sm' onClick={() => handleStatusUpdate(application.id, 'accepted')}>
                  Accept
                </Button>
              )}
            </div>
          </div>
          <p className='text-sm whitespace-pre-wrap'>{application.coverLetter}</p>
        </div>
      ))}
    </div>
  );
}
