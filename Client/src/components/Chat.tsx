import { ArrowIconLeft } from './icons/ArrowIconLeft'
import { useEffect, useRef, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/UseTheme'
import { SendIcon } from './icons/SendIcon'
import { ChatIcon } from './icons/ChatIcon'
import { Avatar } from './ui/Avatar'
import { uniqBy } from 'lodash'
import axios from 'axios'

interface OnlineUser {
  userId: string;
  username: string;
}

interface OfflineUser {
  _id: string;
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
  const [offlinePeople, setOfflinePeople] = useState<OfflineUser[]>([])

  const divUnderMessage = useRef<HTMLDivElement>(null)

  const { username, id, setId, setUsername } = useUser()
  const { toggleDarkMode } = useTheme()

  useEffect(() => {
    connetToWs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function connetToWs () {
    const ws = new WebSocket('ws://localhost:4040')
    setWs(ws)
    ws.addEventListener('message', handleMessages)
    ws.addEventListener('close', () => {
      setTimeout(() => {
        connetToWs()
      }, 1000)
    })
  }

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
    setMessages(pre => ([...pre, { text: [newMessageText], online: [], sender: id, recipient: selectUserId, _id: Date.now() }]))
  }

  const handleLogout = () => {
    axios.post('/logout')
      .then((res) => {
        if (res.status === 200) {
          setUsername('')
          setId('')
          setWs(null)
        }
      })
      .finally(() => {
        window.location.href = '/'
      })
  }

  useEffect(() => {
    const div = divUnderMessage.current
    if (div) {
      div?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  async function getOnlinePeople (): Promise<OfflineUser[]> {
    const response = await axios.get('/people')
    return response.data
  }

  useEffect(() => {
    getOnlinePeople()
      .then(onlineP => {
        const offlinePeople = onlineP.filter(p => p._id !== id).filter(p => !onlinePeople.find(op => op.userId === p._id))
        setOfflinePeople(offlinePeople)
      })
      .catch(error => {
        console.log(error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlinePeople])

  const onlinePeopleWithoutMe = onlinePeople.filter(({ username: onlineUsername }) => onlineUsername !== username)

  const messagesWithOutDuplicates = uniqBy(messages, '_id')

  return (
    <main className="flex h-screen">
      <header className="flex flex-col bg-blue-100 w-1/3 p-2 dark:bg-blue-950 ">
        <nav className='flex-grow-0 text-blue-500 font-bold flex justify-center items-center gap-2 mb-2 '>
          <ChatIcon />
          <ul>MernChat</ul>
          <input type="checkbox" onChange={toggleDarkMode} />
        </nav>
        <h2 className='text-center text-gray-800 font-bold pt-2 pb-4 dark:text-white'>Bienvenido: {username}</h2>
        <section className='h-full'>
          {
            onlinePeopleWithoutMe.map(({ userId, username }) => (
              <section key={userId} onClick={() => setSelectUserId(userId)}
                className={'p-2 border border-b-2 dark:bg-slate-600 border-gray-300 dark:border-gray-600 flex items-center gap-2 cursor-pointer rounded-md mb-1' +
                  (userId === selectUserId ? 'bg-blue-200 dark:bg-blue-700' : '')}>
                {
                  userId === selectUserId && <span className='bg-blue-600 w-1 h-10 rounded-full'></span>
                }
                <Avatar online={true} userId={userId} username={username} key={userId} />
                <span className='text-gray-800 dark:text-white'>{username}</span>
              </section>
            ))
          }
          {
            offlinePeople.map(({ _id, username }) => (
              <section key={_id} onClick={() => setSelectUserId(_id)}>
                <section className={'p-2 border border-b-2 dark:bg-slate-600 border-gray-300 dark:border-gray-600 flex items-center gap-2 cursor-pointer rounded-md mb-1' +
                  (_id === selectUserId ? 'bg-blue-200 dark:bg-blue-700' : '')}>
                  {
                    _id === selectUserId && <span className='bg-blue-600 w-1 h-10 rounded-full'></span>
                  }
                  <Avatar online={false} userId={_id} username={username} key={_id} />
                  <span className='text-gray-800 dark:text-white'>{username}</span>
                </section>
              </section>
            ))
          }
        </section>
        <div className='flex-grow'>
          <button onClick={handleLogout} className='bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-700'>Logout</button>
        </div>
      </header>

      <section className="flex flex-col bg-blue-200 w-2/3 p-2 dark:bg-slate-900">
        <div className='flex-grow'>
          {
            !selectUserId && (
              <div className='flex items-center justify-center h-full gap-2'>
                <ArrowIconLeft />
                <span className='text-gray-800 dark:text-white'>Seleccione un chat para iniciar conversación</span>
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
                className="bg-white border flex-grow p-2 rounded-md" />
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
