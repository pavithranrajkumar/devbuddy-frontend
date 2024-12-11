import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LoadingScreen } from '../ui/loading-screen';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className='min-h-screen w-screen bg-slate-50'>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={cn('flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out', isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20')}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className='flex-1 p-8 w-full'>
          <div className='w-full h-full'>{children}</div>
        </main>
      </div>
    </div>
  );
}
