import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { User } from '@/contexts/auth/types';

interface FreelancerDashboardProps {
  user: User;
}

export function FreelancerDashboard({ user }: FreelancerDashboardProps) {
  return (
    <div className='space-y-8'>
      {/* Hero Section with Gradient */}
      <div className='relative -mt-8 -mx-8 px-8 py-12 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent'>
        <div className='max-w-4xl'>
          <h1 className='text-4xl font-bold tracking-tight mb-3'>Welcome back, {user.name} 👋</h1>
          <p className='text-muted-foreground text-lg'>Your freelance journey continues. Let's find your next exciting project!</p>
        </div>
      </div>

      {/* Quick Actions */}

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <DashboardCard
          title='Available Projects'
          value='12'
          subtext='Matching your skills'
          icon={Icons.briefcase}
          trend='+3 new'
          trendUp={true}
          className='bg-white hover:shadow-md transition-all'
        />
        <DashboardCard
          title='Profile Views'
          value='48'
          subtext='Last 7 days'
          icon={Icons.eye}
          trend='+12%'
          trendUp={true}
          className='bg-white hover:shadow-md transition-all'
        />
        <DashboardCard
          title='Success Rate'
          value='98%'
          subtext='From 24 projects'
          icon={Icons.trophy}
          trend='+2%'
          trendUp={true}
          className='bg-white hover:shadow-md transition-all'
        />
        <DashboardCard
          title='Total Earned'
          value='$8,234'
          subtext='This month'
          icon={Icons.dollarSign}
          trend='+8%'
          trendUp={true}
          className='bg-white hover:shadow-md transition-all'
        />
      </div>

      {/* Main Content Grid */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Profile Completion */}
        <Card className='bg-white hover:shadow-md transition-all'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-medium'>Complete Your Profile</CardTitle>
              <span className='text-2xl font-bold text-primary'>85%</span>
            </div>
            <Progress value={85} className='h-2' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <ProfileTask icon={Icons.image} title='Add a profile picture' completed={true} />
              <ProfileTask icon={Icons.fileText} title='Complete your bio' completed={true} />
              <ProfileTask icon={Icons.award} title='Add your skills' completed={true} />
              <ProfileTask icon={Icons.link} title='Link your portfolio' completed={false} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className='bg-white hover:shadow-md transition-all'>
          <CardHeader>
            <CardTitle className='text-lg font-medium'>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              <ActivityItem icon={Icons.eye} title='Your profile was viewed by 5 clients' timestamp='2 hours ago' highlight />
              <ActivityItem icon={Icons.mail} title='New message from John regarding Project X' timestamp='5 hours ago' />
              <ActivityItem icon={Icons.briefcase} title='New project matching your skills: "React Developer"' timestamp='1 day ago' highlight />
              <ActivityItem icon={Icons.dollarSign} title='Payment received for Project Y' timestamp='2 days ago' />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
interface ProfileTaskProps {
  icon: typeof Icons.user;
  title: string;
  completed: boolean;
}

function ProfileTask({ icon: Icon, title, completed }: ProfileTaskProps) {
  return (
    <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50'>
      <Icon className={cn('h-5 w-5', completed ? 'text-primary' : 'text-muted-foreground')} />
      <span className={completed ? 'text-muted-foreground line-through' : ''}>{title}</span>
      {completed && <Icons.check className='h-4 w-4 text-primary ml-auto' />}
    </div>
  );
}

interface ActivityItemProps {
  icon: typeof Icons.user;
  title: string;
  timestamp: string;
  highlight?: boolean;
}

function ActivityItem({ icon: Icon, title, timestamp, highlight }: ActivityItemProps) {
  return (
    <div className='flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50'>
      <div className={cn('rounded-full p-2', highlight ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600')}>
        <Icon className='h-4 w-4' />
      </div>
      <div className='space-y-1'>
        <p className={cn('text-sm font-medium', highlight && 'text-primary')}>{title}</p>
        <p className='text-xs text-muted-foreground'>{timestamp}</p>
      </div>
    </div>
  );
}
