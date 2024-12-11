import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { Skill, UserSkill } from '@/contexts/auth/types';
import { skillApi } from '@/services/api/skill';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { FormSelectComponent } from '@/components/form/FormSelectComponent';
import { cn } from '@/lib/utils';

const skillSchema = z.object({
  skillId: z.coerce.number(),
  proficiencyLevel: z.enum(['beginner', 'intermediate', 'expert']),
});

type SkillFormValues = z.infer<typeof skillSchema>;

export function SkillsSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skillId: undefined,
      proficiencyLevel: 'intermediate',
    },
  });

  // Filter out already added skills
  const skillOptions = availableSkills
    .filter((skill) => !userSkills.some((us) => us.skillId === skill.id))
    .map((skill) => ({
      value: skill.id.toString(),
      label: skill.name,
    }));

  const proficiencyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' },
  ];

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const [allSkills, userSkillsData] = await Promise.all([skillApi.getAllSkills(), skillApi.getUserSkills()]);
      setAvailableSkills(allSkills);
      setUserSkills(userSkillsData);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast({
        title: 'Error',
        description: 'Failed to load skills',
        variant: 'destructive',
      });
    }
  };

  async function onSubmit(data: SkillFormValues) {
    setIsSubmitting(true);
    try {
      await skillApi.addUserSkill(data);
      await loadSkills(); // Reload skills after adding
      form.reset();

      toast({
        title: 'Success',
        description: 'Skill added successfully.',
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to add skill.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeSkill(skillId: number) {
    try {
      await skillApi.removeUserSkill(skillId);
      await loadSkills(); // Reload skills after removal

      toast({
        title: 'Success',
        description: 'Skill removed successfully.',
      });
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove skill.',
        variant: 'destructive',
      });
    }
  }

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-emerald-50 text-emerald-700';
      case 'intermediate':
        return 'bg-amber-50 text-amber-700';
      case 'beginner':
        return 'bg-sky-50 text-sky-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Add your technical skills and expertise levels</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col md:flex-row gap-4 mb-6'>
              <div className='flex-1'>
                <FormSelectComponent form={form} name='skillId' label='Skill' placeholder='Select a skill to add' options={skillOptions} />
              </div>
              <div className='w-[200px]'>
                <FormSelectComponent form={form} name='proficiencyLevel' label='Proficiency' placeholder='Choose level' options={proficiencyLevels} />
              </div>
              <div className='flex items-end'>
                <Button type='submit' disabled={isSubmitting} className='gap-2'>
                  {isSubmitting ? (
                    <Icons.spinner className='h-4 w-4 animate-spin' />
                  ) : (
                    <>
                      <Icons.plus className='h-4 w-4' />
                      Add Skill
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>

        {userSkills.length === 0 ? (
          <div className='text-center py-8'>
            <Icons.layers className='mx-auto h-12 w-12 text-muted-foreground/50' />
            <h3 className='mt-4 text-sm font-semibold text-muted-foreground'>No skills added</h3>
            <p className='mt-2 text-sm text-muted-foreground'>Start by selecting a skill and proficiency level above.</p>
          </div>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {userSkills.map((skill) => (
              <div
                key={skill.id}
                className='group inline-flex items-center gap-1.5 bg-secondary/50 rounded-md px-2 py-1 hover:bg-secondary/80 transition-colors'
              >
                <span className='font-medium text-sm'>{skill.Skill.name}</span>
                <span
                  className={cn(
                    'inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium capitalize',
                    getProficiencyColor(skill.proficiencyLevel)
                  )}
                >
                  {skill.proficiencyLevel}
                </span>
                <button
                  type='button'
                  onClick={() => removeSkill(skill.id)}
                  className='ml-0.5 -mr-0.5 rounded-full bg-foreground/10 p-0.5 opacity-30 group-hover:opacity-50 hover:!opacity-100 transition-opacity'
                >
                  <Icons.x className='h-3 w-3' />
                  <span className='sr-only'>Remove {skill.Skill.name}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
