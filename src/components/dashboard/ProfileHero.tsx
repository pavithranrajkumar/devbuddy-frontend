import { Icons } from '@/components/ui/icons';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProfileHeroProps {
  data: {
    name: string;
    title: string;
    rating: number | string;
    activeProjects: number;
    completedProjects: number;
    profileCompleteness: number;
  };
}

export function ProfileHero({ data }: ProfileHeroProps) {
  const rating = typeof data.rating === 'string' ? parseFloat(data.rating) : data.rating;

  return (
    <div className='relative overflow-hidden rounded-lg border bg-gradient-to-br from-white to-gray-50/50'>
      <div className='absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]' />
      <div className='relative p-6'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <h1 className='text-2xl font-bold tracking-tight'>{data.name}</h1>
              <p className='text-muted-foreground'>{data.title}</p>
            </div>
            <Badge variant='secondary' className='h-6 px-2 text-xs'>
              Freelancer
            </Badge>
          </div>

          <div className='mt-4 flex flex-wrap items-center gap-6'>
            {/* Rating */}
            <div className='flex items-center gap-2'>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (
                  <Icons.star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : i < rating
                        ? 'fill-yellow-400/50 text-yellow-400/50'
                        : 'fill-muted text-muted'
                    )}
                  />
                ))}
              </div>
              <span className='font-medium'>{rating.toFixed(1)}</span>
            </div>

            {/* Active Projects */}
            <div className='flex items-center gap-2'>
              <Icons.briefcase className='h-4 w-4 text-blue-500' />
              <div className='flex items-center gap-1.5'>
                <span className='font-medium'>{data.activeProjects}</span>
                <span className='text-sm text-muted-foreground'>Active</span>
              </div>
            </div>

            {/* Completed Projects */}
            <div className='flex items-center gap-2'>
              <Icons.checkCircle className='h-4 w-4 text-green-500' />
              <div className='flex items-center gap-1.5'>
                <span className='font-medium'>{data.completedProjects}</span>
                <span className='text-sm text-muted-foreground'>Completed</span>
              </div>
            </div>

            {/* Profile Completion */}
            <div className='flex items-center gap-2'>
              <Icons.user className='h-4 w-4 text-purple-500' />
              <div className='flex items-center gap-2'>
                <Progress value={data.profileCompleteness} className='h-2 w-20' />
                <span className='text-sm font-medium'>{data.profileCompleteness}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
