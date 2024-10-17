import { useAuth } from '../auth/AuthProvider';
import { URL_WS } from '../utils/constanst';
import { useEffect, useState } from 'react';
import Avatar from '../components/Avatar';

interface UsersOnline {
  id: string;
  email: string;
}

interface Messages {
  userId: string;
  text: string;
}

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [peopleOnline, setPeopleOnline] = useState<UsersOnline[]>([])
  const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined)
  const [messages, setMessages] = useState<Messages[]>([])
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
    } else if ('message' in messageData) {
      console.log(messageData);
      const { sender, text } = messageData.message as { id: string, recipient: string, sender: string, text: string }
      setMessages(prev => [...prev, { userId: sender, text }])
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
    setMessages(prev => [...prev, { userId: user!.id, text: newMsg }])
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
              <div className='relative h-full'>
              <section className='overflow-y-scroll absolute inset-0'>
                {
                  messages.map((msg, index) => (
                    <div key={index} className={`flex mb-1 gap-2 ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-2 rounded-md ${msg.userId === user?.id ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                        {msg.text} <br />
                        {user?.id}<br />
                        {msg.userId}
                      </div>
                    </div>
                  ))
                }
              </section>
              </div>
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