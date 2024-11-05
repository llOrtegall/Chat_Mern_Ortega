import { FormEvent, useEffect, useRef, useState } from 'react'
import { useUserContext } from '../context/UserContext';
import Avatar from '../components/Avatar';
import axios from 'axios';

interface PeopleDB {
  _id: string
  username: string
}

interface OnlinePeople {
  userId: string
  username: string
}

interface Messages {
  _id: string
  recipient: string
  sender: string
  text: string
}

interface DataMessage extends MessageEvent {
  online: OnlinePeople[]
  mgsSend: Messages
}

export default function ChatPage() {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [onlinePeople, setOnlinePeople] = useState<OnlinePeople[]>([])
  const [offlinePeople, setOfflinePeople] = useState<PeopleDB[]>([])
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
  const [messages, setMessages] = useState<Messages[]>([])
  const [newMsgText, setNewMsgText] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { id, username, setId, setUsername } = useUserContext()

  useEffect(() => {
    connectToWs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const connectToWs = () => {
    const ws = new WebSocket('ws://localhost:3050')
    setWs(ws)

    ws.addEventListener('message', handleMessage)
    ws.addEventListener('close', () => {
      setTimeout(() => {
        connectToWs()
      }, 3000)
    })
  }

  const handleMessage = (event: MessageEvent) => {
    const msgData = JSON.parse(event.data) as DataMessage
    if (msgData.online) {
      showOnlinePeople(msgData.online)
    } else if (msgData.mgsSend) {
      const { sender, recipient, text, _id } = msgData.mgsSend
      setMessages(prev => [...prev, {
        _id,
        recipient,
        sender,
        text,
      }])
    }
  }

  const showOnlinePeople = (people: OnlinePeople[]) => {
    const onlinePeople = people.filter((person) => person.userId !== id!)
    setOnlinePeople(onlinePeople)
  }

  function sendMessage(ev: FormEvent) {
    ev.preventDefault()

    ws?.send(JSON.stringify({
      recipient: selectedPerson,
      text: newMsgText,
    }))

    setNewMsgText('')
    setMessages(prev => [...prev, {
      _id: new Date().toISOString(),
      recipient: selectedPerson!,
      sender: id!,
      text: newMsgText,
    }]);
  }

  function logOut() {
    axios.post('/logout')
      .then(() => {
        setWs(null)
        setId(null)
        setUsername(null)
      })
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    axios.get<PeopleDB[]>('/people')
      .then(res => {
        const offlinePeople = res.data
          .filter(p => p._id !== id)
          .filter(p => !onlinePeople.find(op => op.userId === p._id))

        setOfflinePeople(offlinePeople)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlinePeople])

  useEffect(() => {
    if (selectedPerson) {
      axios.get('/messages/' + selectedPerson)
        .then(res => {
          setMessages(res.data)
        })
        .catch(err => console.log(err))
    }
  }, [selectedPerson])

  return (
    <section className='h-screen flex'>
      <section className='flex flex-col h-full bg-blue-200 w-1/3 justify-around'>

        <div className='text-2xl text-blue-700 font-bold flex gap-2 items-center justify-center py-2'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
          </svg>

          <p>MernChat</p>
        </div>

        <div className='flex flex-col items-center justify-center overflow-y-auto'>
          {
            onlinePeople.map((person) => (
              <section key={person.userId} className={`flex w-full hover:bg-yellow-50 ${person.userId === selectedPerson ? 'bg-blue-300' : ''}`}>
                <div className={`w-1.5 rounded-r-md bg-blue-600 ${person.userId === selectedPerson ? 'visible' : 'hidden'}`}></div>
                <button onClick={() => setSelectedPerson(person.userId)}
                  className='w-full border-gray-100 py-2 flex items-center gap-3 mx-2'>
                  <Avatar online={true} userId={person.userId} username={person.username} />
                  <p>{person.username}</p>
                </button>
              </section>
            ))
          }
          {
            offlinePeople.map((person) => (
              <section key={person._id} className={`flex w-full hover:bg-yellow-50 ${person._id === selectedPerson ? 'bg-blue-300' : ''}`}>
                <div className={`w-1.5 rounded-r-md bg-blue-600 ${person._id === selectedPerson ? 'visible' : 'hidden'}`}></div>
                <button onClick={() => setSelectedPerson(person._id)}
                  className='w-full border-gray-100 py-2 flex items-center gap-3 mx-2'>
                  <Avatar online={false} userId={person._id} username={person.username} />
                  <p>{person.username}</p>
                </button>
              </section>
            ))
          }
        </div>

        <div className=''>
          <p className='text-blue-700 font-bold text-center'>Welcome {username}</p>
          <button onClick={logOut} className='bg-red-500 text-white w-full py-2'>
            Logout
          </button>
        </div>

      </section>

      <main className='bg-blue-300 flex flex-col w-2/3'>
        <div className='flex-grow overflow-y-auto'>
          {
            !selectedPerson && (
              <div className='flex items-center justify-center h-full'>
                <p className='text-2xl text-blue-700 font-bold'>Select a person to chat with</p>
              </div>
            )
          }
          {
            !!selectedPerson && (
              <div className='mb-4 h-full'>
                <div className='flex flex-col gap-2 p-2 pb-2'>
                  {
                    messages.map((msg) => (
                      <div key={msg._id} className={`flex flex-col gap-1 ${msg.sender === id ? 'items-end' : 'items-start'}`}>
                        <div className={`p-2 rounded-md ${msg.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  }
                  <div ref={messagesEndRef}></div>
                </div>
              </div>
            )
          }
        </div>
        {
          !!selectedPerson && (
            <form className='flex gap-2 m-2' onSubmit={sendMessage}>
              <input value={newMsgText} onChange={(e) => setNewMsgText(e.target.value)}
                type='text' placeholder='type your message here'
                className='bg-white rounded-sm flex-grow px-1' />
              <button 
                className='bg-orange-500 hover:bg-orange-700 p-2 text-white rounded-sm' type='button' >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>

              </button>
              <button className='bg-green-500 p-2 hover:bg-green-700 text-white rounded-sm' type='submit'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='size-6'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5' />
                </svg>
              </button>
            </form>
          )
        }
      </main>
    </section>
  )
}