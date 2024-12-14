import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import moment from 'moment';

interface ApplicationTimelineProps {
  className?: string;
  applications: Array<{
    projectTitle: string;
    status: 'marked_for_interview' | 'accepted' | 'rejected' | 'applied' | 'withdrawn';
    appliedDate: string;
    proposedRate: string | number;
  }>;
}

const statusConfig = {
  marked_for_interview: {
    label: 'Interviewing',
    color: 'bg-orange-500/10 text-orange-500',
    icon: Icons.calendar,
  },
  accepted: {
    label: 'Accepted',
    color: 'bg-green-500/10 text-green-500',
    icon: Icons.checkCircle,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-500/10 text-red-500',
    icon: Icons.xCircle,
  },
  applied: {
    label: 'Applied',
    color: 'bg-blue-500/10 text-blue-500',
    icon: Icons.send,
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'bg-gray-500/10 text-gray-500',
    icon: Icons.undo,
  },
};

export function ApplicationTimeline({ applications, className }: ApplicationTimelineProps) {
  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Recent Applications</CardTitle>
        <Badge variant='secondary' className='text-xs'>
          {applications.length} total
        </Badge>
      </CardHeader>
      <CardContent className='space-y-5'>
        {applications.map((application, index) => {
          const StatusIcon = statusConfig[application.status].icon;
          return (
            <div key={index} className='flex gap-4'>
              <div className='flex flex-col items-center'>
                <div className={cn('rounded-full p-2', statusConfig[application.status].color)}>
                  <StatusIcon className='h-4 w-4' />
                </div>
                {index !== applications.length - 1 && <div className='w-px grow bg-border' />}
              </div>
              <div className='space-y-1.5'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{application.projectTitle}</span>
                  <Badge variant='secondary' className={cn('text-xs', statusConfig[application.status].color)}>
                    {statusConfig[application.status].label}
                  </Badge>
                </div>
                <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1.5'>
                    <Icons.clock className='h-3.5 w-3.5' />
                    <span>{moment(application.appliedDate).fromNow()}</span>
                  </div>
                  <span>•</span>
                  <div className='flex items-center gap-1.5'>
                    <Icons.dollarSign className='h-3.5 w-3.5' />
                    <span>
                      $
                      {typeof application.proposedRate === 'string'
                        ? parseFloat(application.proposedRate).toFixed(2)
                        : application.proposedRate.toFixed(2)}
                      /hr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
