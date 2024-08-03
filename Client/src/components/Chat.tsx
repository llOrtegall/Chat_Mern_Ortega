import { ArrowIconLeft } from './icons/ArrowIconLeft'
import { useUser } from '../context/UserContext'
import { useEffect, useRef, useState } from 'react'
import { SendIcon } from './icons/SendIcon'
import { ChatIcon } from './icons/ChatIcon'
import { Avatar } from './ui/Avatar'
import { uniqBy } from 'lodash'
import axios from 'axios'

interface OnlineUser {
  userId: string;
  username: string;
}

interface MessageData {
  online: OnlineUser[];
  text?: string[];
  isOur?: boolean;
  sender?: string;
}

function Chat () {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [onlinePeople, setOnlinePeople] = useState<OnlineUser[]>([])
  const [selectUserId, setSelectUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageData[]>([])
  const [newMessageText, setNewMessageText] = useState('')

  const divUnderMessage = useRef<HTMLDivElement>(null)

  const { username, id } = useUser()

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4040')
    setWs(ws)
    ws.addEventListener('message', handleMessages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectUserId) {
      axios.get('/messages/' + selectUserId)
        .then(response => {
          setMessages(response.data)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }, [selectUserId])

  const showOnlineUsers = (peopleArray: OnlineUser[]) => {
    const people = {} as Record<string, OnlineUser>

    peopleArray.forEach(({ userId, username }) => {
      people[userId] = { userId, username }
    })

    setOnlinePeople(Object.values(people))
  }

  const handleMessages = (event: MessageEvent) => {
    const messageData: MessageData = JSON.parse(event.data)
    if (messageData.online) {
      showOnlineUsers(messageData.online)
    } else if (messageData.text) {
      setMessages(prev => ([...prev, { ...messageData }]))
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
    setMessages(pre => ([...pre, { text: [newMessageText], online: [], sender: id, recipient: selectUserId, id: Date.now() }]))
  }

  useEffect(() => {
    const div = divUnderMessage.current
    if (div) {
      div?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  const onlinePeopleWithoutMe = onlinePeople.filter(({ username: onlineUsername }) => onlineUsername !== username)

  const messagesWithOutDuplicates = uniqBy(messages, 'id')

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
                <div className='relative h-full'>
                  <div className='overflow-y-auto absolute top-0 left-0 right-0 bottom-4'>
                    {
                      messagesWithOutDuplicates.map(({ text, sender }, index) => (
                        <div key={index} className={(sender === id ? 'text-right' : 'text-left')}>
                          <div className={'text-left inline-block p-2 my-2 rounded-md text-sm ' +
                            (sender === id ? 'bg-blue-500 text-white ' : 'bg-white text-gray-500')}>
                            sender: {sender} <br />
                            my id: {id} <br />
                            {text}
                          </div>
                        </div>
                      ))
                    }
                    <div ref={divUnderMessage}></div>
                  </div>
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
