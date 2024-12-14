import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LoadingDashboard() {
  return (
    <div className='space-y-6 p-6'>
      {/* Loading Hero */}
      <div className='rounded-lg border bg-gradient-to-br from-white to-gray-50/50 p-6'>
        <div className='space-y-4'>
          <div className='flex items-center gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-8 w-[200px]' />
              <Skeleton className='h-4 w-[150px]' />
            </div>
            <Skeleton className='h-6 w-20' />
          </div>
          <div className='flex flex-wrap gap-6'>
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[100px]' />
          </div>
        </div>
      </div>

      {/* Loading Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* Loading Stats */}
        <Card className='md:col-span-2 lg:col-span-1'>
          <CardHeader>
            <Skeleton className='h-5 w-[180px]' />
          </CardHeader>
          <CardContent className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='space-y-2'>
                <div className='flex justify-between'>
                  <Skeleton className='h-4 w-[100px]' />
                  <Skeleton className='h-4 w-[50px]' />
                </div>
                <Skeleton className='h-2 w-full' />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Loading Skills */}
        <Card className='md:col-span-2 lg:col-span-1'>
          <CardHeader>
            <Skeleton className='h-5 w-[150px]' />
          </CardHeader>
          <CardContent className='space-y-6'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='space-y-2'>
                <div className='flex justify-between'>
                  <div className='flex gap-2'>
                    <Skeleton className='h-4 w-[80px]' />
                    <Skeleton className='h-4 w-[60px]' />
                  </div>
                  <Skeleton className='h-4 w-[70px]' />
                </div>
                <Skeleton className='h-2 w-full' />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Loading Timeline */}
        <Card className='md:col-span-2 lg:col-span-1'>
          <CardHeader>
            <Skeleton className='h-5 w-[180px]' />
          </CardHeader>
          <CardContent className='space-y-6'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='flex gap-4'>
                <div className='flex flex-col items-center'>
                  <Skeleton className='h-8 w-8 rounded-full' />
                  {i !== 2 && <Skeleton className='h-full w-1' />}
                </div>
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-[200px]' />
                  <div className='flex gap-2'>
                    <Skeleton className='h-4 w-[100px]' />
                    <Skeleton className='h-4 w-[80px]' />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Loading Projects Grid */}
      <div className='space-y-4'>
        <div className='flex justify-between'>
          <Skeleton className='h-6 w-[150px]' />
          <Skeleton className='h-6 w-[100px]' />
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Skeleton className='h-5 w-[200px]' />
                    <div className='flex flex-wrap gap-2'>
                      {[...Array(3)].map((_, j) => (
                        <Skeleton key={j} className='h-4 w-[60px]' />
                      ))}
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <Skeleton className='h-4 w-[120px]' />
                    <Skeleton className='h-4 w-[80px]' />
                  </div>
                  <Skeleton className='h-9 w-full' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
