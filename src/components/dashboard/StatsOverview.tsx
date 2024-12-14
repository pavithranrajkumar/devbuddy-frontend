import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface StatsOverviewProps {
  className?: string;
  stats: {
    totalApplications: number;
    activeApplications: number;
    successRate: number;
    statusBreakdown: {
      applied: number;
      marked_for_interview: number;
      accepted: number;
      rejected: number;
      withdrawn?: number;
      completed?: number;
    };
  };
}

const statusConfig = {
  applied: {
    label: 'Applied',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    icon: Icons.send,
  },
  marked_for_interview: {
    label: 'Interviewing',
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    icon: Icons.calendar,
  },
  accepted: {
    label: 'Accepted',
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    icon: Icons.checkCircle,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    icon: Icons.xCircle,
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    icon: Icons.undo,
  },
  completed: {
    label: 'Completed',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    icon: Icons.check,
  },
};

export function StatsOverview({ stats, className }: StatsOverviewProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>Applications</span>
          <div className='flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm font-normal text-green-500'>
            <Icons.trendingUp className='h-4 w-4' />
            <span>{stats.successRate.toFixed(1)}% Success</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 md:grid-cols-2'>
          {Object.entries(stats.statusBreakdown).map(([status, count]) => {
            const config = statusConfig[status as keyof typeof statusConfig];
            if (!config || count === 0) return null;

            const percentage = ((count / stats.totalApplications) * 100).toFixed(0);
            const StatusIcon = config.icon;

            return (
              <div
                key={status}
                className={cn('group relative overflow-hidden rounded-lg border p-3 transition-colors hover:border-primary', config.color)}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <StatusIcon className='h-4 w-4' />
                    <span className='font-medium'>{config.label}</span>
                  </div>
                  <span className='text-sm font-medium'>{count}</span>
                </div>
                <div className='mt-1'>
                  <div className='text-xs text-muted-foreground'>{percentage}% of total</div>
                </div>
                <div
                  className={cn('absolute bottom-0 left-0 h-1 transition-all group-hover:opacity-100', config.color.replace('/10', ''))}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className='mt-4 flex items-center justify-between rounded-lg border p-3 bg-secondary/20'>
          <div className='flex items-center gap-2'>
            <Icons.layout className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium'>Total Applications</span>
          </div>
          <span className='font-medium'>{stats.totalApplications}</span>
        </div>
      </CardContent>
    </Card>
  );
}
