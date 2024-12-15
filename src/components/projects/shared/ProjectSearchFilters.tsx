import { useState, useCallback, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';
import { ProjectFiltersInterface } from '@/types/project';
import { ProjectFilters } from './ProjectFilters';

interface ProjectSearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: ProjectFiltersInterface) => void;
  className?: string;
  initialFilters?: ProjectFiltersInterface;
}

export function ProjectSearchFilters({ onSearch, onFilterChange, initialFilters }: ProjectSearchFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProjectFiltersInterface>(initialFilters ?? {});
  const [quickStatus, setQuickStatus] = useState('all');
  const [quickBudget, setQuickBudget] = useState('all');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle search changes
  useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  const handleFilterChange = useCallback(
    (newFilters: ProjectFiltersInterface) => {
      // Validate filters before applying
      const validatedFilters = validateFilters(newFilters);
      setFilters(validatedFilters);
      onFilterChange(validatedFilters);
    },
    [onFilterChange]
  );

  const validateFilters = (filters: ProjectFiltersInterface): ProjectFiltersInterface => {
    const validatedFilters: ProjectFiltersInterface = {};

    // Only add valid budget ranges
    if (filters.budgetMin !== undefined && filters.budgetMax !== undefined) {
      if (Number(filters.budgetMin) > Number(filters.budgetMax)) {
        // Swap if min is greater than max
        [filters.budgetMin, filters.budgetMax] = [filters.budgetMax, filters.budgetMin];
      }
    }

    if (filters.budgetMin !== undefined && Number(filters.budgetMin) >= 0) {
      validatedFilters.budgetMin = Number(filters.budgetMin);
    }

    if (filters.budgetMax !== undefined && Number(filters.budgetMax) > 0) {
      validatedFilters.budgetMax = Number(filters.budgetMax);
    }

    // Validate status
    if (filters.status && ['published', 'in_progress', 'completed', 'cancelled'].includes(filters.status)) {
      validatedFilters.status = filters.status;
    }

    // Validate deadline
    if (filters.hasDeadlineBefore && new Date(filters.hasDeadlineBefore) > new Date()) {
      validatedFilters.hasDeadlineBefore = filters.hasDeadlineBefore;
    }

    return validatedFilters;
  };

  const handleQuickStatusChange = (value: string) => {
    setQuickStatus(value);
    const newFilters = { ...filters };

    if (value !== 'all') {
      newFilters.status = value;
    } else {
      delete newFilters.status;
    }

    handleFilterChange(newFilters);
  };

  const handleQuickBudgetChange = (value: string) => {
    setQuickBudget(value);
    const newFilters = { ...filters };

    switch (value) {
      case '0-1000':
        newFilters.budgetMin = 0;
        newFilters.budgetMax = 1000;
        break;
      case '1000-5000':
        newFilters.budgetMin = 1000;
        newFilters.budgetMax = 5000;
        break;
      case '5000+':
        newFilters.budgetMin = 5000;
        delete newFilters.budgetMax;
        break;
      case 'all':
        delete newFilters.budgetMin;
        delete newFilters.budgetMax;
        break;
    }

    handleFilterChange(newFilters);
  };

  return (
    <div className='bg-background border rounded-lg shadow-sm'>
      <div className='p-4 space-y-4'>
        <div className='flex flex-wrap gap-4'>
          {/* Search Bar */}
          <div className='flex-1 min-w-[240px]'>
            <div className='relative'>
              <Icons.search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input placeholder='Search projects...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-9' />
            </div>
          </div>

          {/* Quick Filters */}
          <div className='flex gap-2'>
            <Select value={quickStatus} onValueChange={handleQuickStatusChange}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue>
                  {quickStatus === 'all'
                    ? 'Status'
                    : quickStatus === 'published'
                    ? 'Published'
                    : quickStatus === 'in_progress'
                    ? 'In Progress'
                    : quickStatus === 'completed'
                    ? 'Completed'
                    : 'Status'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='published'>Published</SelectItem>
                <SelectItem value='in_progress'>In Progress</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={quickBudget} onValueChange={handleQuickBudgetChange}>
              <SelectTrigger className='w-[160px]'>
                <SelectValue>{quickBudget !== 'all' ? `$${quickBudget.replace('-', ' - $')}` : 'Budget Range'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Budgets</SelectItem>
                <SelectItem value='0-1000'>Under $1,000</SelectItem>
                <SelectItem value='1000-5000'>$1,000 - $5,000</SelectItem>
                <SelectItem value='5000+'>$5,000+</SelectItem>
              </SelectContent>
            </Select>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetContent side='right'>
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                </SheetHeader>
                <Separator className='my-4' />
                <ProjectFilters onFilterChange={handleFilterChange} onClose={() => setIsFilterOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
