import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormTextareaComponent } from '@/components/form/FormTextareaComponent';
import { FormFieldComponent } from '@/components/form/FormFieldComponent';
import { useToast } from '@/hooks/use-toast';
import { projectApi } from '@/services/api/project';
import { Skill } from '@/contexts/auth/types';
import { FormMultiSelectComponent } from '@/components/form/FormMultiSelectComponent';
import { skillApi } from '@/services/api/skill';
import moment from 'moment';
import { FormDatePickerComponent } from '@/components/form/FormDatePickerComponent';

const createProjectSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(50, 'String must contain at least 50 character(s)'),
    budgetMin: z
      .number()
      .min(0, 'Minimum budget must be greater than 0')
      .refine((val) => val !== undefined, { message: 'Minimum budget is required' }),
    budgetMax: z
      .number()
      .min(0, 'Maximum budget must be greater than 0')
      .refine((val) => val !== undefined, { message: 'Maximum budget is required' }),
    deadline: z.string().refine(
      (val) => {
        const date = new Date(val);
        return date > new Date();
      },
      { message: 'Deadline must be in the future' }
    ),
    skills: z.array(z.number()).min(1, 'At least one skill is required'),
  })
  .refine(
    (data) => {
      return data.budgetMin <= data.budgetMax;
    },
    {
      message: 'Minimum budget cannot be greater than maximum budget',
      path: ['budgetMin'], // This shows the error on the budgetMin field
    }
  );

type CreateProjectForm = z.infer<typeof createProjectSchema>;

export function CreateProject() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const skills = await skillApi.getAllSkills();
      setAvailableSkills(skills);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast({
        title: 'Error',
        description: 'Failed to load skills',
        variant: 'destructive',
      });
    }
  };

  const form = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      budgetMin: 0,
      budgetMax: 0,
      deadline: '',
      skills: [],
    },
  });

  const onSubmit = async (data: CreateProjectForm) => {
    try {
      setIsSubmitting(true);

      const formData = {
        ...data,
        deadline: moment(data.deadline).utc().format(), // Convert to UTC ISO string
      };

      await projectApi.createProject(formData);
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillsOptions = availableSkills.map((skill) => ({
    label: skill.name,
    value: skill.id,
  }));

  return (
    <div className='container max-w-2xl py-10'>
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Create New Project</h1>
          <p className='text-sm text-muted-foreground mt-2'>Fill in the details below to post your project</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormFieldComponent
              form={form}
              name='title'
              label='Project Title'
              placeholder='Enter project title'
              description='Make it clear and descriptive'
            />

            <FormTextareaComponent
              form={form}
              name='description'
              label='Project Description'
              placeholder='Describe your project requirements'
              description='Include key details and expectations'
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormFieldComponent
                form={form}
                name='budgetMin'
                label='Minimum Budget'
                type='number'
                placeholder='0'
                description='Minimum budget in USD'
              />

              <FormFieldComponent
                form={form}
                name='budgetMax'
                label='Maximum Budget'
                type='number'
                placeholder='0'
                description='Maximum budget in USD'
              />
            </div>

            <FormDatePickerComponent
              form={form}
              name='deadline'
              label='Project Deadline'
              description='When do you need this completed?'
              placeholder='Select deadline date'
            />

            <FormMultiSelectComponent
              form={form}
              name='skills'
              label='Required Skills'
              placeholder='Select required skills'
              options={skillsOptions}
              description='Choose the skills needed for your project'
            />

            <div className='flex items-center justify-end gap-4 pt-4'>
              <Button type='button' variant='outline' onClick={() => navigate('/projects')}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting} className='gap-2'>
                {isSubmitting && <Icons.spinner className='h-4 w-4 animate-spin' />}
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
