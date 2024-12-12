import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectSearchFilters } from './ProjectSearchFilters';
import { projectApi } from '@/services/api/project';
import { Project, ProjectFiltersInterface } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/ui/icons';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectCard } from './ProjectCard';

interface ProjectListViewProps {
  showCreateButton?: boolean;
}

export function ProjectListView({ showCreateButton = false }: ProjectListViewProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ProjectFiltersInterface>({});
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 9;

  const isClient = user?.userType === 'client';

  useEffect(() => {
    loadProjects();
  }, [searchQuery, filters, currentPage]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectApi.getProjects({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        ...filters,
        // Only fetch user's projects if they're a client
        userId: isClient ? user?.id : undefined,
      });
      setProjects(response.projects);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
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

  const handleView = (id: number) => navigate(`/projects/${id}`);
  const handleEdit = (id: number) => navigate(`/projects/${id}/edit`);
  const handleApply = (id: number) => navigate(`/projects/${id}/apply`);
  const handleCreate = () => navigate('/projects/create');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: ProjectFiltersInterface) => {
    setFilters(newFilters);
    setCurrentPage(1);
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
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>{isClient ? 'My Projects' : 'Available Projects'}</h1>
        {showCreateButton && isClient && (
          <Button onClick={handleCreate} className='gap-2'>
            <Icons.plus className='h-4 w-4' />
            Create Project
          </Button>
        )}
      </div>

      <ProjectSearchFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

      {projects.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Icons.inbox className='h-12 w-12 text-muted-foreground/50' />
            <h3 className='mt-4 text-lg font-semibold'>No projects found</h3>
            <p className='text-muted-foreground mt-2'>
              {searchQuery || Object.keys(filters).length > 0
                ? 'Try adjusting your filters to find more projects.'
                : isClient
                ? 'Get started by creating your first project.'
                : 'Check back later for new opportunities.'}
            </p>
            {!searchQuery && Object.keys(filters).length === 0 && isClient && (
              <Button onClick={handleCreate} variant='outline' className='mt-4 gap-2'>
                <Icons.plus className='h-4 w-4' />
                Create Project
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={handleView}
                onEdit={isClient ? handleEdit : undefined}
                onApply={!isClient ? handleApply : undefined}
              />
            ))}
          </div>

          {totalItems > ITEMS_PER_PAGE && (
            <div className='flex flex-col items-center gap-2'>
              <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} siblingsCount={1} />
              <p className='text-sm text-muted-foreground'>
                Showing {projects.length} of {totalItems} projects
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
