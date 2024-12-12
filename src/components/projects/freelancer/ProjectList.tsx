import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectSearchFilters } from '../shared/ProjectSearchFilters';
import { projectApi } from '@/services/api/project';
import { Project, ProjectFiltersInterface } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/ui/icons';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ProjectList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ProjectFiltersInterface>({});
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectApi.getProjects({
        page: currentPage,
        search: searchQuery,
        ...filters,
      });
      setProjects(response.projects);
      setTotalPages(response.totalPages);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getStatusVariant = (status: string): 'default' | 'destructive' | 'secondary' | 'outline' => {
    switch (status) {
      case 'published':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
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
      <ProjectSearchFilters onSearch={handleSearch} onFilterChange={(newFilters) => setFilters({ ...newFilters })} />

      {projects.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Icons.inbox className='h-12 w-12 text-muted-foreground/50' />
            <h3 className='mt-4 text-lg font-semibold'>No projects found</h3>
            <p className='text-muted-foreground mt-2'>Try adjusting your filters to find more projects.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {projects.map((project) => (
              <Card key={project.id} className='flex flex-col'>
                <CardHeader>
                  <CardTitle className='flex justify-between items-start gap-2'>
                    <span className='truncate'>{project.title}</span>
                    <Badge variant={getStatusVariant(project.status)}>{project.status.replace('_', ' ')}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Budget: {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex-1'>
                  <p className='text-sm text-muted-foreground line-clamp-2'>{project.description}</p>
                  <div className='mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                      <Icons.calendar className='h-4 w-4' />
                      <span>Due {formatDate(project.deadline)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-end gap-2'>
                  <Button variant='outline' size='sm' onClick={() => handleView(project.id)}>
                    View Details
                  </Button>
                  <Button size='sm' onClick={() => handleApply(project.id)}>
                    Apply
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className='flex flex-col items-center gap-2'>
              <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} siblingsCount={1} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
