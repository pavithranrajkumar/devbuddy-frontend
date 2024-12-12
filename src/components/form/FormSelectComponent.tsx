/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn, Path } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface BaseSelectProps {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  description?: string;
}

interface FormSelectProps<T extends Record<string, any>> extends BaseSelectProps {
  form: UseFormReturn<T>;
  name: Path<T>;
}

interface StandaloneSelectProps extends BaseSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

type SelectProps<T extends Record<string, any>> = FormSelectProps<T> | StandaloneSelectProps;

const isFormSelect = <T extends Record<string, any>>(props: SelectProps<T>): props is FormSelectProps<T> => {
  return 'form' in props && 'name' in props;
};

export function FormSelectComponent<T extends Record<string, any>>(props: SelectProps<T>) {
  if (isFormSelect(props)) {
    const { form, name, label, options, required = false, description, placeholder } = props;

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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  } else {
    const { label, options, required = false, description, value, onChange, error, placeholder } = props;

    return (
      <div className='flex flex-col gap-2'>
        <div className='text-sm font-medium text-foreground'>
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </div>
        <Select onValueChange={onChange} value={value}>
          <SelectTrigger className={error ? 'border-destructive' : ''}>
            <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
 * <FormSelectComponent
 *   form={form}
 *   name="category"
 *   label="Category"
 *   options={[
 *     { value: "1", label: "Option 1" },
 *     { value: "2", label: "Option 2" }
 *   ]}
 *   required
 *   description="Select a category"
 * />
 *
 * 2. Without Form (Standalone):
 * <FormSelectComponent
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 *   label="Category"
 *   options={[
 *     { value: "1", label: "Option 1" },
 *     { value: "2", label: "Option 2" }
 *   ]}
 *   required
 *   error={error}
 *   description="Select a category"
 * />
 */
