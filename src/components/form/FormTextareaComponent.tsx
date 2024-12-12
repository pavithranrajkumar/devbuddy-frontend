/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn, Path } from 'react-hook-form';

interface BaseTextareaProps {
  label: string;
  placeholder: string;
  required?: boolean;
  description?: string;
}

interface FormTextareaProps<T extends Record<string, any>> extends BaseTextareaProps {
  form: UseFormReturn<T>;
  name: Path<T>;
}

interface StandaloneTextareaProps extends BaseTextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

type TextareaProps<T extends Record<string, any>> = FormTextareaProps<T> | StandaloneTextareaProps;

const isFormTextarea = <T extends Record<string, any>>(props: TextareaProps<T>): props is FormTextareaProps<T> => {
  return 'form' in props && 'name' in props;
};

export function FormTextareaComponent<T extends Record<string, any>>(props: TextareaProps<T>) {
  if (isFormTextarea(props)) {
    const { form, name, label, placeholder, required = false, description } = props;

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
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  } else {
    const { label, placeholder, required = false, description, value, onChange, error } = props;

    return (
      <div className='flex flex-col gap-2'>
        <div className='text-sm font-medium text-foreground'>
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </div>
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          className={error ? 'border-destructive focus:ring-destructive' : ''}
        />
        {description && <p className='text-sm text-muted-foreground'>{description}</p>}
        {error && <p className='text-sm font-medium text-destructive'>{error}</p>}
      </div>
    );
  }
}

/**
 * Usage Examples:
 *
 * 1. With Form:
 * <FormTextareaComponent
 *   form={form}
 *   name="description"
 *   label="Description"
 *   placeholder="Enter description"
 *   required
 *   description="Provide detailed information"
 * />
 *
 * 2. Without Form (Standalone):
 * <FormTextareaComponent
 *   value={description}
 *   onChange={setDescription}
 *   label="Description"
 *   placeholder="Enter description"
 *   required
 *   error={error}
 *   description="Provide detailed information"
 * />
 */
