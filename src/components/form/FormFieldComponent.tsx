/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn, Path } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface BaseFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  description?: string;
}

interface FormFieldProps<T extends Record<string, any>> extends BaseFieldProps {
  form: UseFormReturn<T>;
  name: Path<T>;
}

interface StandaloneFieldProps extends BaseFieldProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string;
}

type FieldProps<T extends Record<string, any>> = FormFieldProps<T> | StandaloneFieldProps;

const isFormField = <T extends Record<string, any>>(props: FieldProps<T>): props is FormFieldProps<T> => {
  return 'form' in props && 'name' in props;
};

export function FormFieldComponent<T extends Record<string, any>>(props: FieldProps<T>) {
  if (isFormField(props)) {
    const { form, name, label, placeholder, type = 'text', required = false, leftIcon, description } = props;

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
  } else {
    const { label, placeholder, type = 'text', required = false, leftIcon, description, value, onChange, error } = props;

    return (
      <div className='flex flex-col gap-2'>
        <div className='text-sm font-medium text-foreground'>
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </div>
        <div className='relative'>
          {leftIcon && <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>{leftIcon}</div>}
          <Input
            type={type}
            placeholder={placeholder}
            required={required}
            className={cn(leftIcon && 'pl-10', error && 'border-destructive')}
            value={value || ''}
            onChange={(e) => {
              const newValue = type === 'number' ? (e.target.value === '' ? 0 : Number(e.target.value)) : e.target.value;
              onChange?.(newValue);
            }}
          />
        </div>
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
 * <FormFieldComponent
 *   form={form}
 *   name="username"
 *   label="Username"
 *   placeholder="Enter your username"
 *   required
 *   description="Choose a unique username"
 * />
 *
 * 2. Without Form (Standalone):
 * <FormFieldComponent
 *   value={username}
 *   onChange={setUsername}
 *   label="Username"
 *   placeholder="Enter your username"
 *   required
 *   error={error}
 *   description="Choose a unique username"
 * />
 */
