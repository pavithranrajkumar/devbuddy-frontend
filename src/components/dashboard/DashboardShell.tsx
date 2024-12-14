import { cn } from '@/lib/utils';

export function DashboardShell({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex-1 space-y-6 p-6', className)} {...props}>
      <div className='space-y-6'>{children}</div>
    </div>
  );
}
