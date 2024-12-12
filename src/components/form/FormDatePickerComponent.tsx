/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface BaseDatePickerProps {
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: (date: Date) => boolean;
  required?: boolean;
}

interface FormDatePickerProps extends BaseDatePickerProps {
  form: UseFormReturn<any>;
  name: string;
}

interface StandaloneDatePickerProps extends BaseDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  error?: string;
}

type DatePickerProps = FormDatePickerProps | StandaloneDatePickerProps;

const isFormDatePicker = (props: DatePickerProps): props is FormDatePickerProps => {
  return 'form' in props && 'name' in props;
};

export function FormDatePickerComponent(props: DatePickerProps) {
  if (isFormDatePicker(props)) {
    // Original Form Version
    const { form, name, label, placeholder = 'Pick a date', description, disabled, required } = props;

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className='flex flex-col'>
            <FormLabel className='text-foreground'>
              {label}
              {required && <span className='text-destructive ml-1'>*</span>}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                    {field.value ? format(field.value, 'PPP') : <span>{placeholder}</span>}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar mode='single' selected={field.value} onSelect={field.onChange} disabled={disabled} initialFocus />
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  } else {
    // Standalone Version
    const { label, placeholder = 'Pick a date', description, disabled, value, onChange, error, required } = props;

    return (
      <div className='flex flex-col gap-2'>
        <div className='text-sm font-medium text-foreground'>
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn('w-full pl-3 text-left font-normal', !value && 'text-muted-foreground', error && 'border-destructive')}
            >
              {value ? format(value, 'PPP') : <span>{placeholder}</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar mode='single' selected={value} onSelect={onChange} disabled={disabled} initialFocus />
          </PopoverContent>
        </Popover>
        {description && <p className='text-sm text-muted-foreground'>{description}</p>}
        {error && <p className='text-sm font-medium text-destructive'>{error}</p>}
      </div>
    );
  }
}

/**USAGE
 * // With form 
<FormDatePickerComponent
  form={form}
  name="deadline"
  label="Project Deadline"
  description="When do you need this completed?"
  required
/>

// Without form 
<FormDatePickerComponent
  value={date}
  onChange={setDate}
  label="Select Date"
  description="Choose a date"
  error={error}
  required
/>
 */
