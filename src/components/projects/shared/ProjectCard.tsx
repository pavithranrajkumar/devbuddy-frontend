import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onView: (id: number) => void;
  onEdit?: (id: number) => void;
  onApply?: (id: number) => void;
}

export function ProjectCard({ project, onView, onEdit, onApply }: ProjectCardProps) {
  const { user } = useAuth();
  const isClient = user?.userType === 'client';

  const getStatusVariant = (status: string): 'default' | 'destructive' | 'outline' | 'secondary' => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'in_progress':
        return 'outline';
      case 'completed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className='flex flex-col'>
      <CardHeader>
        <div className='flex justify-between items-start gap-2'>
          <h3 className='font-semibold text-lg truncate'>{project.title}</h3>
          <Badge variant={getStatusVariant(project.status)}>{project.status.replace('_', ' ')}</Badge>
        </div>
        <p className='text-sm text-muted-foreground'>
          Budget: {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
        </p>
      </CardHeader>

      <CardContent className='flex-1 space-y-4'>
        <p className='text-sm text-muted-foreground line-clamp-2'>{project.description}</p>

        {/* Skills Section */}
        <div className='space-y-2'>
          <p className='text-sm font-medium text-muted-foreground'>Required Skills:</p>
          <div className='flex flex-wrap gap-1.5'>
            {project.skills.map((skill) => (
              <Badge key={skill.id} variant='secondary' className='text-xs px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20'>
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <Icons.calendar className='h-4 w-4' />
            <span>Due {formatDate(project.deadline)}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Icons.users className='h-4 w-4' />
            <span>{project.applicantsCount} applicants</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='flex justify-end gap-2 pt-4'>
        <Button variant='outline' size='sm' onClick={() => onView(project.id)}>
          View Details
        </Button>

        {isClient && onEdit && (
          <Button variant='outline' size='sm' onClick={() => onEdit(project.id)}>
            Edit
          </Button>
        )}

        {!isClient && onApply && project.status === 'published' && (
          <Button size='sm' onClick={() => onApply(project.id)}>
            Apply
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
