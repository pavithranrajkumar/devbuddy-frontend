import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { FormTextareaComponent } from '@/components/form/FormTextareaComponent';
import { FormFieldComponent } from '@/components/form/FormFieldComponent';
import { applicationApi } from '@/services/api/application';

const applicationSchema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  proposedRate: z.number().min(1, 'Please specify your proposed rate'),
  estimatedDuration: z.number().min(1, 'Please specify estimated duration in days'),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export function ProjectApplication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: '',
      proposedRate: 0,
      estimatedDuration: 0,
    },
  });

  const onSubmit = async (data: ApplicationForm) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await applicationApi.applyToProject(Number(id), data);

      toast({
        title: 'Success',
        description: 'Application submitted successfully',
      });

      navigate(`/projects/${id}`);
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Submit Application</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormTextareaComponent
            form={form}
            name='coverLetter'
            label='Cover Letter'
            placeholder="Explain why you're the best fit for this project..."
            required
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormFieldComponent form={form} name='proposedRate' label='Proposed Rate ($/hr)' placeholder='Enter your rate' type='number' required />

            <FormFieldComponent
              form={form}
              name='estimatedDuration'
              label='Estimated Duration (days)'
              placeholder='Enter estimated days'
              type='number'
              required
            />
          </div>

          <div className='flex justify-end gap-4'>
            <Button type='button' variant='outline' onClick={() => navigate(`/projects/${id}`)}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
