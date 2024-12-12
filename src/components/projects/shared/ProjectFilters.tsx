import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProjectFiltersInterface } from '@/types/project';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface ProjectFiltersProps {
  onFilterChange: (filters: ProjectFiltersInterface) => void;
  onClose: () => void;
}

export function ProjectFilters({ onFilterChange, onClose }: ProjectFiltersProps) {
  const [status, setStatus] = useState<string>('all');
  const [budgetMin, setBudgetMin] = useState<string>('');
  const [budgetMax, setBudgetMax] = useState<string>('');

  const handleApply = () => {
    const filters: ProjectFiltersInterface = {};
    if (status && status !== 'all') filters.status = [status];
    if (budgetMin) filters.budgetMin = parseInt(budgetMin);
    if (budgetMax) filters.budgetMax = parseInt(budgetMax);
    onFilterChange(filters);
    onClose();
  };

  const handleReset = () => {
    setStatus('all');
    setBudgetMin('');
    setBudgetMax('');
    onFilterChange({});
    onClose();
  };

  return (
    <div className='space-y-6 px-2'>
      {/* Status Section */}
      <div className='space-y-4'>
        <Label className='text-base font-semibold'>Project Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value='published'>Published</SelectItem>
            <SelectItem value='draft'>Draft</SelectItem>
            <SelectItem value='in_progress'>In Progress</SelectItem>
            <SelectItem value='completed'>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Budget Range Section */}
      <div className='space-y-4'>
        <Label className='text-base font-semibold'>Budget Range</Label>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label className='text-sm text-muted-foreground'>Minimum ($)</Label>
            <Input type='number' min='0' placeholder='0' value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} className='w-full' />
          </div>
          <div className='space-y-2'>
            <Label className='text-sm text-muted-foreground'>Maximum ($)</Label>
            <Input
              type='number'
              min={budgetMin || '0'}
              placeholder='Any'
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className='w-full'
            />
          </div>
        </div>
      </div>

      <div className='sticky bottom-0 bg-background pt-4 border-t space-y-2'>
        <Button onClick={handleApply} className='w-full' variant='default'>
          Apply Filters
        </Button>
        <Button onClick={handleReset} className='w-full' variant='outline'>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
