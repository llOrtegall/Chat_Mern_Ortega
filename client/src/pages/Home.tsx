import { useAuth } from '../auth/AuthProvider';
import { useEffect, useState } from 'react'
import Avatar from '../components/Avatar';

const URL_WS = import.meta.env.VITE_URL_WS!;

interface UsersOnline {
  id: string;
  email: string;
}

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [peopleOnline, setPeopleOnline] = useState<UsersOnline[]>([])
  const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined)
  const [messages, setMessages] = useState<string[]>([])
  const [newMsg, setNewMsg] = useState<string>('')
  const { user } = useAuth()

  useEffect(() => {
    const webSocket = new WebSocket(URL_WS)

    setWs(webSocket)

    webSocket.addEventListener('message', handleMessage)
  }, [])

  const handleMessage = (ev: MessageEvent) => {
    const messageData = JSON.parse(ev.data)

    if ('online' in messageData) {
      showOnlineUsers(messageData.online)
    } else if ('text' in messageData) {
      setMessages(prev => ([...prev, messageData.text]))
    }
  }

  const showOnlineUsers = (online: UsersOnline[]) => {
    setPeopleOnline(online)
  }

  const sendMessage = (ev: React.FormEvent) => {
    ev.preventDefault()

    ws?.send(JSON.stringify({
      message: {
        recipient: selectedUser,
        text: newMsg
      }
    }))
    setNewMsg('')
    setMessages(prev => ([...prev, newMsg]))
  }

  const onlineUserExcludeMe = peopleOnline.filter(p => p.id !== user?.id)

  return (
    <section className='flex w-full h-screen'>
      <aside className='w-3/12 bg-blue-100'>
        {
          onlineUserExcludeMe.length > 0 && (
            <div className=''>
              {
                onlineUserExcludeMe.map((user, index) => (
                  <div key={user.id} onClick={() => setSelectedUser(user.id)}
                    className={`px-2 hover:bg-yellow-200 border-b border-gray-300 flex items-center gap-2 py-1 cursor-pointer ${user.id === selectedUser ? 'bg-blue-200' : ''}`}>
                    {selectedUser === user.id && (
                      <div className='w-1 bg-blue-500 h-10 rounded-md'>

                      </div>
                    )}
                    <Avatar email={user.email} num={index + 1} />
                    <p>
                      {user.email.split('@')[0]}
                    </p>
                  </div>
                ))
              }
            </div>
          )
        }
      </aside>

      <main className='flex flex-col w-9/12 bg-blue-300 h-full px-2'>
        <div className='flex-grow'>
          {
            !selectedUser && (
              <section className='flex h-full items-center justify-center'>
                <div className='text-gray-500'>&larr; no select person</div>
              </section>
            )
          }
          {
            !!selectedUser && (
              <section>
                {messages.map((msg) => (
                  <div key={msg}>{msg}</div>
                ))}
              </section>
            )
          }
        </div>
        {
          !!selectedUser && (
            <form className='flex gap-2 py-2 w-full' onSubmit={sendMessage}>
              <input type='text' value={newMsg} onChange={e => setNewMsg(e.target.value)}
                className='w-full p-2 rounded-md' />
              <button type='submit' className='w-24 bg-blue-500 px-4 py-2 rounded-md'>
                Send
              </button>
            </form>
          )
        }
      </main>
    </section>
  )
}