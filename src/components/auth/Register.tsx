import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormFieldComponent } from '@/components/form/FormFieldComponent';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/ui/icons';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cleanObject } from '@/lib/utils';

// Separate schemas for client and freelancer
const baseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  userType: z.enum(['client', 'freelancer']),
});

const freelancerSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  hourlyRate: z.number().min(0, 'Hourly rate must be at least 0').max(1000, 'Hourly rate must not exceed 1000').optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  experienceYears: z.number().min(0, 'Years must be at least 0').max(50, 'Years must not exceed 50'),
  experienceMonths: z.number().min(0, 'Months must be at least 0').max(11, 'Months must not exceed 11'),
});

const formSchema = z
  .discriminatedUnion('userType', [
    z.object({
      ...baseSchema.omit({ userType: true }).shape,
      userType: z.literal('client'),
    }),
    z.object({
      ...baseSchema.omit({ userType: true }).shape,
      userType: z.literal('freelancer'),
      ...freelancerSchema.shape,
    }),
  ])
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .transform((data) => {
    if (data.userType === 'freelancer') {
      return {
        ...data,
        experienceInMonths: data.experienceYears * 12 + data.experienceMonths,
      };
    }
    return data;
  });

type FormData = z.infer<typeof formSchema>;

export function Register() {
  const { register: authRegister, isAuthenticating } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'client',
    } as FormData,
    mode: 'onChange',
  });

  const userType = form.watch('userType');

  const onSubmit = async (values: FormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = values;
      await authRegister(cleanObject(registerData));
      toast({
        title: 'Success!',
        description: 'Your account has been created',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'An error occurred during registration. Please try again.',
      });
    }
  };

  const handleSocialAuth = (provider: 'github' | 'google') => {
    // Implement social authentication
    console.log(`${provider} authentication clicked`);
  };

  return (
    <div className='min-h-screen w-screen flex overflow-x-hidden'>
      {/* Left side - Hero/Branding with enhanced styling */}
      <div className='hidden lg:flex lg:w-2/3 relative items-center justify-center bg-slate-900'>
        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-slate-900/0'></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>

        {/* Animated circles */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -left-4 -top-24 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl animate-blob'></div>
          <div className='absolute -right-4 -bottom-24 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl animate-blob animation-delay-2000'></div>
        </div>

        {/* Content */}
        <div className='relative z-10 px-16'>
          <div className='mb-8'>
            <div className='h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4'>
              <Icons.logo className='h-8 w-8 text-primary' />
            </div>
          </div>
          <h1 className='text-7xl font-bold text-white mb-8 tracking-tight'>
            Join
            <br />
            DevBuddy
          </h1>
          <p className='text-xl text-slate-300 max-w-xl leading-relaxed'>
            Start your journey with us today. Connect, collaborate, and create amazing projects with developers worldwide.
          </p>
        </div>
      </div>

      {/* Right side - Register Form with enhanced styling */}
      <div className='w-full lg:w-1/3 flex items-center justify-center p-8 bg-white dark:bg-slate-900'>
        <div className='w-full max-w-md'>
          {' '}
          {/* Added max-width for better readability */}
          <Card className='shadow-none border-0 bg-white/50 dark:bg-slate-900'>
            <CardHeader className='space-y-1 pb-8'>
              <CardTitle className='text-2xl font-bold text-center'>Create an account</CardTitle>
              <CardDescription className='text-center text-base'>Enter your details to get started</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='space-y-4'>
                    <FormFieldComponent form={form} name='name' label='Full Name' placeholder='John Doe' required />

                    <FormFieldComponent form={form} name='email' label='Email' placeholder='name@example.com' required />

                    <FormFieldComponent form={form} name='password' label='Password' placeholder='••••••••' type='password' required />

                    <FormFieldComponent form={form} name='confirmPassword' label='Confirm Password' placeholder='••••••••' type='password' required />
                  </div>

                  <FormField
                    control={form.control}
                    name='userType'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>I want to...</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='grid grid-cols-2 gap-4'>
                            <div>
                              <RadioGroupItem value='client' id='client' className='peer sr-only' />
                              <Label
                                htmlFor='client'
                                className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-slate-100 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                              >
                                <Icons.user className='mb-2 h-6 w-6' />
                                <span>Hire Developers</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem value='freelancer' id='freelancer' className='peer sr-only' />
                              <Label
                                htmlFor='freelancer'
                                className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-slate-100 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
                              >
                                <Icons.code className='mb-2 h-6 w-6' />
                                <span>Work as Developer</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {userType === 'freelancer' && (
                    <div className='space-y-4 pt-4 border-t'>
                      <div className='grid grid-cols-2 gap-4'>
                        <FormFieldComponent form={form} name='experienceYears' label='Experience (Years)' placeholder='0-50' type='number' required />
                        <FormFieldComponent
                          form={form}
                          name='experienceMonths'
                          label='Experience (Months)'
                          placeholder='0-11'
                          type='number'
                          required
                        />
                      </div>

                      <FormFieldComponent
                        form={form}
                        name='title'
                        label='Professional Title'
                        placeholder='e.g. Senior Full Stack Developer'
                        required
                      />

                      <FormFieldComponent form={form} name='bio' label='Bio' placeholder='Tell us about yourself (minimum 10 characters)' required />

                      <FormFieldComponent form={form} name='hourlyRate' label='Hourly Rate ($)' placeholder='0-1000' type='number' />

                      <FormFieldComponent form={form} name='linkedinUrl' label='LinkedIn URL' placeholder='https://linkedin.com/in/yourprofile' />

                      <FormFieldComponent form={form} name='githubUrl' label='GitHub URL' placeholder='https://github.com/yourusername' />
                    </div>
                  )}

                  <Button type='submit' className='w-full h-11 text-base font-medium' disabled={isAuthenticating}>
                    {isAuthenticating ? (
                      <>
                        <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </Button>

                  <div className='relative my-6'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='w-full border-t border-slate-200 dark:border-slate-700'></div>
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                      <span className='bg-white dark:bg-slate-900 px-2 text-muted-foreground'>Or continue with</span>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <Button type='button' variant='outline' className='h-11 bg-white dark:bg-slate-900' onClick={() => handleSocialAuth('github')}>
                      <Icons.gitHub className='mr-2 h-4 w-4' />
                      GitHub
                    </Button>
                    <Button type='button' variant='outline' className='h-11 bg-white dark:bg-slate-900' onClick={() => handleSocialAuth('google')}>
                      <Icons.google className='mr-2 h-4 w-4' />
                      Google
                    </Button>
                  </div>

                  <div className='text-center text-sm text-muted-foreground'>
                    Already have an account?{' '}
                    <Link to='/login' className='font-medium text-primary hover:underline'>
                      Sign in
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
