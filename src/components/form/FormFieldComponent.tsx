/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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
}

export function FormFieldComponent<T extends Record<string, any>>({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
  leftIcon,
}: FormFieldComponentProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='relative'>
              {leftIcon && <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>{leftIcon}</div>}
              <Input {...field} type={type} placeholder={placeholder} required={required} className={cn(leftIcon && 'pl-10')} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
