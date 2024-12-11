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

const formSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    userType: z.enum(['client', 'freelancer']),
    title: z.string().optional(),
    bio: z.string().optional(),
    hourlyRate: z
      .string()
      .transform((val) => (val ? Number(val) : undefined))
      .optional(),
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    experienceYears: z
      .string()
      .transform((val) => (val ? Number(val) : undefined))
      .optional(),
    experienceMonths: z
      .string()
      .transform((val) => (val ? Number(val) : undefined))
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .transform((data) => ({
    ...data,
    experienceInMonths: data.experienceYears || data.experienceMonths ? (data.experienceYears || 0) * 12 + (data.experienceMonths || 0) : undefined,
  }));

type FormData = z.infer<typeof formSchema>;

export function Register() {
  const { register, isAuthenticating } = useAuth();
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
      title: '',
      bio: '',
      hourlyRate: undefined,
      experienceYears: 0,
      experienceMonths: 0,
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: FormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = cleanObject(values);
      await register(cleanObject(registerData));
      toast({
        title: 'Success!',
        description: 'Your account has been created',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Registration failed',
      });
    }
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
        <div className='w-full'>
          <div className='lg:hidden text-center mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-100'>DevBuddy</h1>
            <p className='text-slate-600 dark:text-slate-400'>Create your account</p>
          </div>

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

                  <div className='space-y-3'>
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
                  </div>

                  {form.watch('userType') === 'freelancer' && (
                    <div className='space-y-4 pt-4 border-t'>
                      <div className='grid grid-cols-2 gap-4'>
                        <FormFieldComponent
                          form={form}
                          name='experienceYears'
                          label='Experience (Years)'
                          placeholder='e.g. 3'
                          type='number'
                          required={false}
                        />
                        <FormFieldComponent
                          form={form}
                          name='experienceMonths'
                          label='Experience (Months)'
                          placeholder='e.g. 6'
                          type='number'
                          required={false}
                        />
                      </div>
                      <FormFieldComponent
                        form={form}
                        name='title'
                        label='Professional Title'
                        placeholder='e.g. Senior Full Stack Developer'
                        required
                      />

                      <FormFieldComponent form={form} name='bio' label='Bio' placeholder='Tell us about yourself and your experience' required />

                      <FormFieldComponent form={form} name='hourlyRate' label='Hourly Rate ($)' placeholder='e.g. 50' type='text' required={false} />

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
                    <Button variant='outline' className='h-11 bg-white dark:bg-slate-900'>
                      <Icons.gitHub className='mr-2 h-4 w-4' />
                      GitHub
                    </Button>
                    <Button variant='outline' className='h-11 bg-white dark:bg-slate-900'>
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
