import { useEffect, useState } from 'react'
import { SendIcon } from './icons/SendIcon'
import { ChatIcon } from './icons/ChatIcon';

interface OnlineUser {
  userId: string;
  username: string;
}

interface MessageData {
  online: OnlineUser[];
}

function Chat () {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [onlinePeople, setOnlinePeople] = useState<OnlineUser[]>([])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4040')
    setWs(ws)
    ws.addEventListener('message', handleMessages)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMessages = (event: MessageEvent) => {
    const messageData: MessageData = JSON.parse(event.data)
    showOnlineUsers(messageData.online)
  }

  const showOnlineUsers = (peopleArray: OnlineUser[]) => {
    const people = {} as Record<string, OnlineUser>

    peopleArray.forEach(({ userId, username }) => {
      people[userId] = { userId, username }
    })

    setOnlinePeople(Object.values(people))
  }

  console.log(ws)

  return (
    <main className="flex h-screen">
      <header className="bg-blue-100 w-1/3 p-2">
        <nav className='text-blue-500 font-bold flex justify-center gap-2 mb-2'>
          <ChatIcon />
          <ul>MernChat</ul>
        </nav>
        {
          onlinePeople.map(({ userId, username }) => (
            <div key={userId} className="p-2 border-b-2 border-gray-300">
              {username}
            </div>
          ))
        }
      </header>
      <section className="flex flex-col bg-blue-200 w-2/3 p-2">
        <div className='flex-grow'>
          messages selected person
        </div>
        <form className='flex gap-2'>
          <input type="text" placeholder='type your message here'
            className="bg-white border flex-grow  p-2 rounded-md" />
          <button className="bg-blue-600 p-2 text-white rounded-md">
            <SendIcon />
          </button>
        </form>
      </section>
    </main>
  )
}

export default Chat
