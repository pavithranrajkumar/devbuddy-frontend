import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatExperience = (totalMonths?: number) => {
    if (!totalMonths) return null;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return `${years}y${months ? ` ${months}m` : ''} exp`;
  };

  return (
    <header className='sticky top-0 z-40 border-b bg-white shadow-sm'>
      <div className='flex h-16 items-center justify-between px-6'>
        <div className='flex items-center'>
          <Button variant='ghost' size='icon' onClick={toggleSidebar} className='lg:hidden'>
            <Icons.menu className='h-6 w-6' />
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='flex items-center gap-2 px-3 py-2 hover:bg-slate-100'>
                <div className='flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white'>{user?.name?.[0]?.toUpperCase()}</div>
                <div className='hidden md:block text-left'>
                  <p className='text-sm font-medium'>{user?.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    <span className='capitalize'>{user?.userType}</span>
                    {user?.userType === 'freelancer' && user?.experienceInMonths && (
                      <span className='ml-1'>• {formatExperience(user.experienceInMonths)}</span>
                    )}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <Icons.user className='mr-2 h-4 w-4' />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className='text-red-600 focus:text-red-600'>
                <Icons.logout className='mr-2 h-4 w-4' />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
