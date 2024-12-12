import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    budgetMin: number;
    budgetMax: number;
    deadline: string;
    status: string;
    skills: number[];
    applicantsCount: number;
  };
  onView: (id: number) => void;
  onEdit?: (id: number) => void;
  onApply?: (id: number) => void;
}

export function ProjectCard({ project, onView, onEdit, onApply }: ProjectCardProps) {
  const { user } = useAuth();
  const isClient = user?.userType === 'client';

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold text-lg'>{project.title}</h3>
          <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>{project.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-2'>
        <p className='text-sm text-muted-foreground line-clamp-2'>{project.description}</p>

        <div className='flex justify-between text-sm'>
          <span>
            Budget: {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
          </span>
          <span>Deadline: {formatDate(project.deadline)}</span>
        </div>

        <div className='flex flex-wrap gap-1'>
          {project.skills.map((skill) => (
            <Badge key={skill} variant='secondary' className='text-xs'>
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className='flex justify-between items-center'>
        <span className='text-sm text-muted-foreground'>{project.applicantsCount} applications</span>

        <div className='flex gap-2'>
          <Button variant='outline' size='sm' onClick={() => onView(project.id)}>
            View Details
          </Button>

          {isClient && onEdit && (
            <Button variant='outline' size='sm' onClick={() => onEdit(project.id)}>
              Edit
            </Button>
          )}

          {!isClient && onApply && (
            <Button size='sm' onClick={() => onApply(project.id)}>
              Apply
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
