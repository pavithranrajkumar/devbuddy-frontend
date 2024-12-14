import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onView: (id: number) => void;
  onEdit?: (id: number) => void;
  onApply?: (id: number) => void;
  applicationStatus?: string;
}

export function ProjectCard({ project, onView, onApply, applicationStatus }: ProjectCardProps) {
  const getProgressColor = (count: number) => {
    if (count >= 20) return 'from-red-500/80 to-red-500';
    if (count >= 10) return 'from-yellow-500/80 to-yellow-500';
    return 'from-green-500/80 to-green-500';
  };

  return (
    <div
      onClick={() => onView(project.id)}
      className='group p-5 bg-white rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-[0_0_1rem_rgba(0,0,0,0.04)] transition-all duration-200 relative overflow-hidden cursor-pointer'
    >
      <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

      <div className='relative'>
        <div className='flex justify-between items-start gap-4'>
          <h3 className='text-base font-semibold truncate group-hover:text-primary transition-colors'>{project.title}</h3>
          <Badge variant='secondary' className='capitalize text-xs px-2.5 py-1 bg-secondary/10 text-secondary-foreground/70 shrink-0 shadow-sm'>
            {project.status.replace('_', ' ')}
          </Badge>
        </div>

        <p className='mt-2 text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed'>{project.description}</p>

        <div className='mt-3.5 flex flex-wrap gap-1.5'>
          {project.skills?.slice(0, 4).map((skill) => (
            <Badge
              key={skill.id}
              variant='outline'
              className='px-2.5 py-0.5 text-xs font-medium border-border/50 bg-white shadow-sm hover:bg-primary/5 hover:border-primary/30 transition-colors'
            >
              {skill.name}
            </Badge>
          ))}
          {project.skills?.length > 4 && (
            <Badge variant='outline' className='px-2.5 py-0.5 text-xs font-medium hover:bg-primary/5'>
              +{project.skills.length - 4} more
            </Badge>
          )}
        </div>

        <div className='mt-5 grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg group-hover:bg-muted/40 transition-colors'>
          <div>
            <p className='text-xs text-muted-foreground/70 font-medium'>Budget</p>
            <p className='mt-0.5 font-medium text-sm'>
              ${project.budgetMin} - ${project.budgetMax}
            </p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground/70 font-medium'>Deadline</p>
            <p className='mt-0.5 font-medium text-sm'>{formatDate(project.deadline)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground/70 font-medium'>Applications</p>
            <div className='mt-2 flex items-center gap-2'>
              <div className='flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden'>
                <div
                  className={`h-full bg-gradient-to-r ${getProgressColor(project.applicantsCount || 0)} transition-all duration-300`}
                  style={{
                    width: `${Math.min((project.applicantsCount || 0) * 10, 100)}%`,
                  }}
                />
              </div>
              <span className='font-medium text-sm'>{project.applicantsCount || 0}</span>
            </div>
          </div>
        </div>

        {onApply && (
          <div className='mt-4 flex justify-end'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(project.id);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${applicationStatus ? 'bg-muted text-muted-foreground cursor-default' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
              disabled={!!applicationStatus}
            >
              {applicationStatus || 'Apply Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
