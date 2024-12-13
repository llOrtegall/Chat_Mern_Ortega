import { Input } from '@/components/Input'

export const InputSearch = () => (
  <div className='w-full px-2 space-y-2'>
    <Input
      placeholder='Search users or start new chat'
      id='search'
      name='search'
      type='search'
      className='mt-2'
    />
  </div>
)