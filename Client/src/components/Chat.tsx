import { ArrowIconLeft } from './icons/ArrowIconLeft'
import { useUser } from '../context/UserContext'
import { useEffect, useState } from 'react'
import { SendIcon } from './icons/SendIcon'
import { ChatIcon } from './icons/ChatIcon'
import { Avatar } from './ui/Avatar'

interface OnlineUser {
  userId: string;
  username: string;
}

interface MessageData {
  online: OnlineUser[];
  text?: string[];
  isOur?: boolean;
}

function Chat () {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [onlinePeople, setOnlinePeople] = useState<OnlineUser[]>([])
  const [selectUserId, setSelectUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageData[]>([])
  const [newMessageText, setNewMessageText] = useState('')

  const { username } = useUser()

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4040')
    setWs(ws)
    ws.addEventListener('message', handleMessages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showOnlineUsers = (peopleArray: OnlineUser[]) => {
    const people = {} as Record<string, OnlineUser>

    peopleArray.forEach(({ userId, username }) => {
      people[userId] = { userId, username }
    })

    setOnlinePeople(Object.values(people))
  }

  const handleMessages = (event: MessageEvent) => {
    console.log(event.data)
    const messageData: MessageData = JSON.parse(event.data)
    if (messageData.online) {
      showOnlineUsers(messageData.online)
    } else {
      setMessages(prev => [...prev, { isOur: false, text: messageData.text, online: [] }])
    }
  }

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault()
    ws?.send(JSON.stringify(
      {
        recipient: selectUserId,
        text: newMessageText
      }
    ))
    setNewMessageText('')
    setMessages(pre => ([...pre, { isOur: true, text: [newMessageText], online: [] }]))
  }

  const onlinePeopleWithoutMe = onlinePeople.filter(({ username: onlineUsername }) => onlineUsername !== username)

  return (
    <main className="flex h-screen">
      <header className="bg-blue-100 w-1/3 p-2">
        <nav className='text-blue-500 font-bold flex justify-center gap-2 mb-2'>
          <ChatIcon />
          <ul>MernChat</ul>
        </nav>
        {
          onlinePeopleWithoutMe.map(({ userId, username }) => (
            <section key={userId} onClick={() => setSelectUserId(userId)}
              className={'p-2 border border-b-2 border-gray-300 flex items-center gap-2 cursor-pointer rounded-md mb-1 ' +
                (userId === selectUserId ? 'bg-blue-200' : '')}>
              {
                userId === selectUserId && <span className='bg-blue-600 w-1 h-10 rounded-full'></span>
              }
              <Avatar userId={userId} username={username} key={userId} />
              <span className='text-gray-800'>{username}</span>
            </section>
          ))
        }
      </header>

      <section className="flex flex-col bg-blue-200 w-2/3 p-2">
        <div className='flex-grow'>
          {
            !selectUserId && (
              <div className='flex items-center justify-center h-full gap-2'>
                <ArrowIconLeft />
                <span className='text-gray-800'>Seleccione un chat para iniciar conversación</span>
              </div>
            )
          }
          {
            !!selectUserId && (
              <div className='flex flex-col gap-2 h-full overflow-y-auto'>
                {
                  messages.map(({ text, isOur }, index) => (
                    <div key={index} className={'p-2 rounded-md ' + (isOur ? 'bg-blue-600 text-white self-end' : 'bg-gray-300 text-gray-800 self-start')}>
                      {text}
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>

        {
          !!selectUserId && (
            <form className='flex gap-2' onSubmit={sendMessage}>
              <input type="text" placeholder='type your message here'
                value={newMessageText} onChange={e => setNewMessageText(e.target.value)}
                className="bg-white border flex-grow  p-2 rounded-md" />
              <button className="bg-blue-600 p-2 text-white rounded-md">
                <SendIcon />
              </button>
            </form>
          )
        }

      </section>
    </main>
  )
}

export default Chat
