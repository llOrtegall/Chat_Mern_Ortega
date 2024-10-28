import { useEffect, useState } from 'react'
import { useUserContext } from '../context/UserContext';
import Avatar from '../components/Avatar';

interface OnlinePeople {
  userId: string;
  username: string;
}

interface DataMessage extends MessageEvent {
  online: OnlinePeople[];
}

export default function ChatPage() {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [onlinePeople, setOnlinePeople] = useState<OnlinePeople[]>([])
  const { id } = useUserContext()

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3050')

    setWs(ws)

    ws.addEventListener('message', handleMessage)
  }, [])

  const handleMessage = (event: MessageEvent) => {
    const msgData = JSON.parse(event.data) as DataMessage
    if (msgData.online) {
      showOnlinePeople(msgData.online)
    }
  }

  const showOnlinePeople = (people: OnlinePeople[]) => {
    const onlinePeople = people.filter((person) => person.userId !== id)
    setOnlinePeople(onlinePeople)
  }

  return (
    <section className='h-screen flex'>
      <section className='bg-blue-200 w-1/3'>
        <div className='text-2xl text-blue-500 font-bold flex gap-2 items-center justify-center py-2'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
          </svg>

          <p>MernChat</p>
        </div>
        {
          onlinePeople.map((person) => (
            <div key={person.userId} className='border-b border-gray-100 py-2 flex items-center gap-3 mx-2'>
              <Avatar userId={person.userId} username={person.username} />
              <p>{person.username}</p>
            </div>
          ))
        }
      </section>
      <main className='bg-blue-300 flex flex-col w-2/3'>
        <div className='flex-grow'>messages with selected person</div>
        <div className='flex gap-2 m-2'>
          <input type='text' placeholder='type your message here' className='bg-white rounded-sm flex-grow px-1' />
          <button className='bg-green-500 p-2 text-white rounded-sm'>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-6'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5' />
            </svg>
          </button>
        </div>
      </main>
    </section>
  )
}