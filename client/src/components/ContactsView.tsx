import { OfflineUser, OnlineUser } from '../types/type'
import { Avatar } from './ui/Avatar'

interface ShowMessagesProps {
  onlinePeople: OnlineUser[]
  offlinePeople: OfflineUser[]
  funSelectUserId: (userId: string) => void
  selectUserId: string | null
}

export const ContatsViews = ({ offlinePeople, onlinePeople, funSelectUserId, selectUserId }: ShowMessagesProps) => {
  return (
    <section className='h-full'>
      {
        onlinePeople.map(({ userId, email }) => (
          <section key={userId} onClick={() => funSelectUserId(userId)}
            className={'p-2 border border-b-2 dark:bg-slate-600 border-gray-300 dark:border-gray-600 flex items-center gap-2 cursor-pointer rounded-md mb-1' +
              (userId === selectUserId ? 'bg-blue-200 dark:bg-blue-700' : '')}>
            {
              userId === selectUserId && <span className='bg-blue-600 w-1 h-10 rounded-full'></span>
            }
            <Avatar online={true} userId={userId} email={email} key={userId} />
            <span className='text-gray-800 dark:text-white'>{email}</span>
          </section>
        ))
      }
      {
        offlinePeople.map(({ _id, email }) => (
          <section key={_id} onClick={() => funSelectUserId(_id)}>
            <section className={'p-2 border border-b-2 dark:bg-slate-600 border-gray-300 dark:border-gray-600 flex items-center gap-2 cursor-pointer rounded-md mb-1' +
              (_id === selectUserId ? 'bg-blue-200 dark:bg-blue-700' : '')}>
              {
                _id === selectUserId && <span className='bg-blue-600 w-1 h-10 rounded-full'></span>
              }
              <Avatar online={false} userId={_id} email={email} key={_id} />
              <span className='text-gray-800 dark:text-white'>{email}</span>
            </section>
          </section>
        ))
      }
    </section>
  )
}