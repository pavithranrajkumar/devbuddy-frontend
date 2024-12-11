/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn, Path } from 'react-hook-form';

interface FormTextareaComponentProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  required?: boolean;
}

export function FormTextareaComponent<T extends Record<string, any>>({
  form,
  name,
  label,
  placeholder,
  required = false,
}: FormTextareaComponentProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className='text-foreground'>
            {label}
            {required && <span className='text-destructive ml-1'>*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              {...field}
              className={`${fieldState.error ? 'border-red-500 focus:ring-red-500' : ''}`}
              onBlur={() => {
                field.onBlur();
                form.trigger(name);
              }}
              required={required}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
