import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectSearchFilters } from './ProjectSearchFilters';
import { projectApi } from '@/services/api/project';
import { Project, ProjectFiltersInterface, ProjectApplication } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/ui/icons';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectCard } from './ProjectCard';
import { applicationApi } from '@/services/api/application';

interface ProjectListViewProps {
  showCreateButton?: boolean;
}

interface StatCardProps {
  icon: keyof typeof Icons;
  title: string;
  value: number;
  color: string;
}

const StatCard = ({ icon, title, value, color }: StatCardProps) => {
  const Icon = Icons[icon];
  return (
    <div className='bg-white p-4 rounded-xl border border-border/50 shadow-sm'>
      <div className='flex items-center gap-3'>
        <div className={`p-2 bg-${color}/10 rounded-lg`}>
          <Icon className={`h-5 w-5 text-${color}`} />
        </div>
        <div>
          <p className='text-sm font-medium text-muted-foreground'>{title}</p>
          <h3 className='text-2xl font-bold text-foreground'>{value}</h3>
        </div>
      </div>
    </div>
  );
};

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
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const isFreelancer = user?.userType === 'freelancer';

  const isClient = user?.userType === 'client';

  useEffect(() => {
    loadProjects();
    if (isFreelancer) {
      loadApplications();
    }
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

  const loadApplications = async () => {
    try {
      const data = await applicationApi.getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const getApplicationStatus = (projectId: number) => {
    return applications.find((app) => app.projectId === projectId)?.status;
  };

  const handleView = (id: number) => navigate(`/projects/${id}`);
  const handleEdit = (id: number) => navigate(`/projects/${id}/edit`);
  const handleApply = (id: number) => {
    const status = getApplicationStatus(id);
    if (status) {
      toast({
        title: 'Application Status',
        description: `You have already applied to this project. Status: ${status}`,
      });
      return;
    }
    navigate(`/projects/${id}/apply`);
  };
  const handleCreate = () => navigate('/projects/create');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: ProjectFiltersInterface) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const stats: StatCardProps[] = [
    {
      icon: 'layers',
      title: 'Total Projects',
      value: totalItems,
      color: 'primary',
    },
    {
      icon: 'checkCircle',
      title: 'Active Projects',
      value: projects.filter((p) => p.status === 'in_progress').length,
      color: 'green-500',
    },
    {
      icon: 'users',
      title: 'Total Applications',
      value: projects.reduce((sum, p) => sum + (p.applicantsCount || 0), 0),
      color: 'blue-500',
    },
    {
      icon: 'award',
      title: 'Completed Projects',
      value: projects.filter((p) => p.status === 'completed').length,
      color: 'green-500',
    },
  ];

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
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setFilters({});
              setSearchQuery('');
            }}
            disabled={Object.keys(filters).length === 0 && !searchQuery}
            className='text-sm'
          >
            <Icons.reset className='mr-2 h-4 w-4' />
            Reset Filters
          </Button>
          {showCreateButton && isClient && (
            <Button onClick={handleCreate} className='gap-2'>
              <Icons.plus className='h-4 w-4' />
              Create Project
            </Button>
          )}
        </div>
      </div>

      <ProjectSearchFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

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
                applicationStatus={isFreelancer ? getApplicationStatus(project.id) : undefined}
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
