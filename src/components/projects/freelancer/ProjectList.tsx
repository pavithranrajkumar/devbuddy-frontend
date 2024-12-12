import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from '../shared/ProjectCard';
import { ProjectFilters } from '../shared/ProjectFilters';
import { projectApi } from '@/services/api/project';
import { Project } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/ui/icons';

export function ProjectList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectApi.getProjects(filters);
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id: number) => {
    navigate(`/projects/${id}`);
  };

  const handleApply = (id: number) => {
    navigate(`/projects/${id}/apply`);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Icons.spinner className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <ProjectFilters onFilterChange={setFilters} />

      {projects.length === 0 ? (
        <div className='text-center py-12'>
          <Icons.inbox className='mx-auto h-12 w-12 text-muted-foreground/50' />
          <h3 className='mt-4 text-sm font-semibold text-muted-foreground'>No projects found</h3>
          <p className='mt-2 text-sm text-muted-foreground'>Try adjusting your filters to find more projects.</p>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onView={handleView} onApply={handleApply} />
          ))}
        </div>
      )}
    </div>
  );
}
