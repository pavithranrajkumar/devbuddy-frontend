import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function DashboardCard({ title, value, subtext, icon: Icon, trend, trendUp, className }: DashboardCardProps) {
  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className='rounded-full bg-primary/10 p-2'>
          <Icon className='h-4 w-4 text-primary' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <div className='flex items-center gap-2'>
          <p className='text-xs text-muted-foreground'>{subtext}</p>
          {trend && <span className={`text-xs font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
