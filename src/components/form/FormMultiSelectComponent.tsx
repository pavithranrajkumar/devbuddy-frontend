/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XCircle, ChevronDown, XIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';

interface Option {
  label: string;
  value: number;
}

interface FormMultiSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  options: Option[];
  maxCount?: number;
  required?: boolean;
}

export function FormMultiSelectComponent({
  form,
  name,
  label,
  options,
  placeholder = 'Select options...',
  description,
  maxCount = 3,
  required = false,
}: FormMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedValues = form.watch(name) || [];

  useEffect(() => {
    if (!Array.isArray(selectedValues)) {
      form.setValue(name, [], { shouldValidate: false });
    }
  }, [form, name, selectedValues]);

  const handleSelect = (optionValue: number) => {
    const currentValues = Array.isArray(selectedValues) ? selectedValues : [];
    const newValues = currentValues.includes(optionValue) ? currentValues.filter((value) => value !== optionValue) : [...currentValues, optionValue];

    form.setValue(name, newValues, { shouldValidate: true });
  };

  const handleClear = () => {
    form.setValue(name, [], { shouldValidate: true });
  };

  const handleSelectAll = () => {
    const allValues = options.map((option) => option.value);
    form.setValue(name, allValues, { shouldValidate: true });
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel className='text-foreground'>
            {label}
            {required && <span className='text-destructive ml-1'>*</span>}
          </FormLabel>{' '}
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between min-h-10 h-auto'>
                  <div className='flex justify-between items-center w-full'>
                    <div className='flex flex-wrap items-center gap-1'>
                      {selectedValues.length > 0 ? (
                        <>
                          {selectedValues.slice(0, maxCount).map((value: number) => (
                            <Badge variant='secondary' key={value} className='mr-1 pr-1'>
                              {options.find((option) => option.value === value)?.label}
                              <XCircle
                                className='ml-1 h-3 w-3 cursor-pointer'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelect(value);
                                }}
                              />
                            </Badge>
                          ))}
                          {selectedValues.length > maxCount && <Badge variant='secondary'>+{selectedValues.length - maxCount} more</Badge>}
                        </>
                      ) : (
                        <span className='text-muted-foreground'>{placeholder}</span>
                      )}
                    </div>
                    <div className='flex items-center'>
                      {selectedValues.length > 0 && (
                        <>
                          <XIcon
                            className='h-4 w-4 cursor-pointer text-muted-foreground'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClear();
                            }}
                          />
                          <Separator orientation='vertical' className='mx-2 h-4' />
                        </>
                      )}
                      <ChevronDown className='h-4 w-4 opacity-50' />
                    </div>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start' side='bottom' sideOffset={4}>
                <Command className='max-h-[300px] overflow-hidden'>
                  <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                  <CommandList className='max-h-[225px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                    <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem onSelect={handleSelectAll}>
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            selectedValues.length === options.length ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <CheckIcon className='h-4 w-4' />
                        </div>
                        <span>Select All</span>
                      </CommandItem>
                      {options.map((option) => (
                        <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                          <div
                            className={cn(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                              selectedValues.includes(option.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                            )}
                          >
                            <CheckIcon className='h-4 w-4' />
                          </div>
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                      <div className='flex items-center justify-between p-2 bg-background sticky bottom-0 border-t'>
                        {selectedValues.length > 0 && (
                          <>
                            <Button variant='outline' size='sm' className='flex-1 h-8 hover:bg-muted' onClick={handleClear}>
                              Clear
                            </Button>
                            <Separator orientation='vertical' className='h-4' />
                          </>
                        )}
                        <Button variant='secondary' size='sm' className='flex-1 h-8 hover:bg-muted' onClick={() => setOpen(false)}>
                          Close
                        </Button>
                      </div>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
