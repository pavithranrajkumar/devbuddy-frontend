import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import moment from 'moment';

interface ProjectsGridProps {
  projects: Array<{
    title: string;
    budgetRange: {
      min: string | number;
      max: string | number;
    };
    requiredSkills: string[];
    postedDate: string;
    matchScore: number;
  }>;
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold tracking-tight'>Matching Projects</h2>
        <Button variant='ghost' size='sm'>
          View All
          <Icons.arrowRight className='ml-2 h-4 w-4' />
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {projects.map((project, index) => (
          <Card key={index} className='group relative overflow-hidden transition-all hover:shadow-md'>
            {/* Match Score Badge */}
            <div className='absolute right-4 top-4'>
              <Badge className={cn('bg-emerald-500/10 text-emerald-500', project.matchScore >= 90 && 'bg-emerald-500/20')}>
                {project.matchScore}% Match
              </Badge>
            </div>

            <CardContent className='p-6'>
              <div className='space-y-4'>
                {/* Project Title */}
                <div className='space-y-2'>
                  <h3 className='font-semibold tracking-tight group-hover:text-primary transition-colors'>{project.title}</h3>
                  <div className='flex flex-wrap gap-2'>
                    {project.requiredSkills.map((skill) => (
                      <Badge key={skill} variant='secondary' className='text-xs bg-secondary/50'>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div className='flex items-center justify-between text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1.5'>
                    <Icons.dollarSign className='h-4 w-4' />
                    <span>
                      $
                      {typeof project.budgetRange.min === 'string'
                        ? parseFloat(project.budgetRange.min).toLocaleString()
                        : project.budgetRange.min.toLocaleString()}{' '}
                      - $
                      {typeof project.budgetRange.max === 'string'
                        ? parseFloat(project.budgetRange.max).toLocaleString()
                        : project.budgetRange.max.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Icons.clock className='h-4 w-4' />
                    <span>{moment(project.postedDate).fromNow()}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className='pt-4'>
                  <Button className='w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors' variant='outline'>
                    View Details
                    <Icons.arrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
