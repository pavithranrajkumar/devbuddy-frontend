import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SkillsCardProps {
  className?: string;
  skills: Array<{
    name: string;
    proficiencyLevel: 'expert' | 'intermediate' | 'beginner';
    category: string;
  }>;
}

const proficiencyConfig = {
  expert: {
    color: 'bg-orange-500',
    percentage: 90,
    label: 'Expert',
  },
  intermediate: {
    color: 'bg-blue-500',
    percentage: 65,
    label: 'Intermediate',
  },
  beginner: {
    color: 'bg-green-500',
    percentage: 40,
    label: 'Beginner',
  },
};

export function SkillsCard({ skills, className }: SkillsCardProps) {
  console.log({ skills });
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Skills & Expertise</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {skills.map((skill, index) => (
          <div key={index} className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>{skill.name}</span>
                <Badge variant='secondary' className='text-xs'>
                  {skill.category}
                </Badge>
              </div>
              <span className='text-sm text-muted-foreground'>{proficiencyConfig[skill.proficiencyLevel].label}</span>
            </div>
            <div className='h-2 w-full rounded-full bg-secondary'>
              <div
                className={cn('h-full rounded-full transition-all', proficiencyConfig[skill.proficiencyLevel].color)}
                style={{
                  width: `${proficiencyConfig[skill.proficiencyLevel].percentage}%`,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
