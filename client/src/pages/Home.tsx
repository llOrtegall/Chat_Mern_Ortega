import { useEffect, useState } from "react"
import Avatar from "../components/Avatar";
import { useAuth } from "../auth/AuthProvider";

const URL_WS = import.meta.env.VITE_URL_WS!;

interface UsersOnline {
  id: string;
  email: string;
}

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [peopleOnline, setPeopleOnline] = useState<UsersOnline[]>([])
  const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined)
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
    }
  }

  const showOnlineUsers = (online: UsersOnline[]) => {
    setPeopleOnline(online)
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
                        <div className="w-1 bg-blue-500 h-10 rounded-md">

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
      <main className='w-9/12 bg-blue-300'>
        <h1>Chats</h1>
      </main>
    </section>
  )
}