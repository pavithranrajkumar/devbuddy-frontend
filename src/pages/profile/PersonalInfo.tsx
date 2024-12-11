import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormFieldComponent } from '@/components/form/FormFieldComponent';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/ui/icons';
import { Card, CardContent } from '@/components/ui/card';
import { profileApi } from '@/services/api/profile';
import { FormTextareaComponent } from '@/components/form/FormTextareaComponent';

const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  title: z.string().optional(),
  experienceInMonths: z.coerce.number().min(0).max(600).optional(),
  hourlyRate: z.coerce.number().min(0).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export function PersonalInfo() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      title: user?.title || '',
      hourlyRate: user?.hourlyRate || undefined,
      linkedinUrl: user?.linkedinUrl || '',
      githubUrl: user?.githubUrl || '',
      experienceInMonths: user?.experienceInMonths || undefined,
    },
  });

  async function onSubmit(data: PersonalInfoValues) {
    try {
      await profileApi.updateProfile(data);
      toast({ title: 'Success', description: 'Your profile has been updated.' });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile.',
      });
    }
  }

  return (
    <div>
      <Card className='border-none shadow-none '>
        <CardContent className='p-6'>
          <div className='flex items-center space-x-4 mb-4'>
            <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center'>
              <Icons.user className='h-6 w-6 text-primary' />
            </div>
            <div>
              <h2 className='text-lg font-semibold'>{user?.name || 'Your Profile'}</h2>
              <p className='text-sm text-muted-foreground'>{user?.email}</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                {/* Basic Information */}
                <div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                    <FormFieldComponent form={form} name='name' label='Full Name' placeholder='Enter your full name' required />
                    <FormFieldComponent form={form} name='email' label='Email' placeholder='Enter your email' type='email' required />
                    {user?.userType === 'freelancer' && (
                      <FormFieldComponent form={form} name='title' label='Professional Title' placeholder='e.g., Senior Full Stack Developer' />
                    )}
                  </div>
                </div>

                {/* Professional Details */}
                {user?.userType === 'freelancer' && (
                  <div className='mt-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <FormFieldComponent
                        form={form}
                        name='experienceInMonths'
                        label='Experience (months)'
                        type='number'
                        placeholder='Enter total months of experience'
                      />
                      <FormFieldComponent form={form} name='hourlyRate' label='Hourly Rate ($)' type='number' placeholder='Enter your hourly rate' />
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className='mt-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <FormFieldComponent
                      form={form}
                      name='linkedinUrl'
                      label='LinkedIn URL'
                      placeholder='https://linkedin.com/in/username'
                      type='url'
                      leftIcon={<Icons.linkedin className='h-4 w-4' />}
                    />
                    <FormFieldComponent
                      form={form}
                      name='githubUrl'
                      label='GitHub URL'
                      placeholder='https://github.com/username'
                      type='url'
                      leftIcon={<Icons.gitHub className='h-4 w-4' />}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className='mt-4'>
                  <FormTextareaComponent form={form} name='bio' label='Bio' placeholder='Tell us about yourself and your professional journey' />
                </div>
              </div>

              <div className='flex justify-end pt-2'>
                <Button type='submit'>Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
