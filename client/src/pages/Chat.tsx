import { MessageData, OnlineUser, Messages } from '../types/type'
import { ArrowIconLeft } from '../components/icons/ArrowIconLeft'
import { useEffect, useRef, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/UseTheme'
import { ShowMessages } from '../components/ShowMessages'
import { ContatsViews } from '../components/ContactsView'
import { ChatIcon } from '../components/icons/ChatIcon'
import { FormSensMsg } from '../components/FormSensMsg'
import { WS_API } from '../utils/constans'

import { uniqBy } from 'lodash'
import axios from 'axios'
import { useOffUsers } from '../hooks/useOffUsers'
import { useNavigate } from 'react-router-dom'

function Chat() {
  const { email, id, setId, setEmail } = useUser()
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [onlinePeople, setOnlinePeople] = useState<OnlineUser[]>([])
  const [selectUserId, setSelectUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Messages[]>([])
  const [newMessageText, setNewMessageText] = useState('')

  const { offlinePeople } = useOffUsers({ id: id, onlinePeople })
  const navigate = useNavigate()

  const divUnderMessage = useRef<HTMLDivElement>(null)

  const { toggleDarkMode } = useTheme()

  useEffect(() => {
    connetToWs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function connetToWs() {
    const ws = new WebSocket(`${WS_API}`)
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

  const handleMessages = (event: MessageEvent) => {
    const messageData: MessageData = JSON.parse(event.data)
    if (messageData.online) {
      setOnlinePeople(messageData.online)
    } else if (messageData.messages) {
      setMessages(prev => ([...prev, { ...messageData.messages }]))
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
    setMessages(pre => ([...pre, { text: newMessageText, sender: id, recipient: selectUserId!, id: Math.random().toString() }]))
  }

  const handleLogout = () => {
    axios.post('/logout')
      .then((res) => {
        if (res.status === 200) {
          setEmail('')
          setId('')
          setWs(null)
        }
      })
      .finally(() => {
        navigate('/')
      })
  }

  useEffect(() => {
    const div = divUnderMessage.current
    if (div) {
      div?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  const onlinePeopleWithoutMe = onlinePeople.filter(p => p.userId !== id)

  const messagesWithOutDuplicates = uniqBy(messages, '_id')

  return (
    <main className="flex h-screen">
      <header className="flex flex-col bg-blue-100 w-1/3 p-2 dark:bg-blue-950 ">
        <nav className='flex-grow-0 text-blue-500 font-bold flex justify-center items-center gap-2 mb-2 '>
          <ChatIcon />
          <ul>MernChat</ul>
          <input type="checkbox" onChange={toggleDarkMode} />
        </nav>
        <h2 className='text-center text-gray-800 font-bold pt-2 pb-4 dark:text-white'>Bienvenido: {email}</h2>

        <ContatsViews offLineUsers={offlinePeople} onlinePeople={onlinePeopleWithoutMe} selectUserId={selectUserId} funSelectUserId={setSelectUserId}   />

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
            !!selectUserId && <ShowMessages id={id} messages={messagesWithOutDuplicates} refScroll={divUnderMessage} />
          }
        </div>

        {
          !!selectUserId && <FormSensMsg newMessageText={newMessageText} sendMessage={sendMessage} setNewMessageText={setNewMessageText} />
        }
      </section>
    </main>
  )
}

export default Chat
