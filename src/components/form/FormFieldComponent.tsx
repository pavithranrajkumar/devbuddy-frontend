/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn, Path } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormFieldComponentProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  description?: string;
}

export function FormFieldComponent<T extends Record<string, any>>({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  leftIcon,
  description,
}: FormFieldComponentProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-foreground'>
            {label}
            {required && <span className='text-destructive ml-1'>*</span>}
          </FormLabel>
          <FormControl>
            <div className='relative'>
              {leftIcon && <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>{leftIcon}</div>}
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                required={required}
                className={cn(leftIcon && 'pl-10')}
                value={field.value || ''}
                onChange={(e) => {
                  const value = type === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value)) : e.target.value;
                  field.onChange(value);
                }}
                onBlur={() => {
                  field.onBlur();
                  form.trigger(name);
                }}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
