import { cn } from '@/lib/utils';

export function LoadingScreen({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border',
    default: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center'>
      <div className={cn('rounded-full border-white/30 border-t-white animate-spin', sizeClasses[size])} />
    </div>
  );
}
