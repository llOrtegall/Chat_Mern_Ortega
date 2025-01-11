import { Skeleton } from '@/components/ui/skeleton'
import { Loading } from '@/components/ui/loading'

export function SkeletonRegister() {
  return (
    <section className='h-screen w-screen flex flex-col justify-center items-center'>

      <div className='w-96 space-y-2'>
        <Skeleton className='h-4 w-36' />
        <Skeleton className='h-10' />
        <Skeleton className='h-4 w-36' />
        <Skeleton className='h-10' />
        <Skeleton className='h-8 w-60' />
        <Skeleton className='h-4 w-full' />
      </div>

      <Loading />
    </section>
  )
}
