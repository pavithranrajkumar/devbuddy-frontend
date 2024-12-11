import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user } = useAuth();

  const clientLinks = [
    { href: '/dashboard', icon: Icons.home, label: 'Overview' },
    { href: '/projects', icon: Icons.folder, label: 'Projects' },
    { href: '/messages', icon: Icons.message, label: 'Messages' },
  ];

  const freelancerLinks = [
    { href: '/dashboard', icon: Icons.home, label: 'Overview' },
    { href: '/jobs', icon: Icons.briefcase, label: 'Find Jobs' },
    { href: '/messages', icon: Icons.message, label: 'Messages' },
  ];

  const links = user?.userType === 'client' ? clientLinks : freelancerLinks;

  return (
    <>
      {isOpen && <div className='fixed inset-0 z-40 bg-black/80 lg:hidden' onClick={() => setIsOpen(false)} />}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20',
          'transition-all duration-300'
        )}
      >
        <div className='flex h-16 items-center gap-3 border-b px-6'>
          <Icons.logo className='h-6 w-6 text-primary' />
          {isOpen && <span className='text-lg font-semibold'>DevBuddy</span>}
        </div>

        <nav className='flex-1 space-y-1 p-4'>
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )
              }
            >
              <link.icon className={cn('h-5 w-5', isOpen ? 'mr-3' : 'mr-0')} />
              {isOpen && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
