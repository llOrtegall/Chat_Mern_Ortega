import { Smile, Paperclip, SendHorizonal, MessageCircleCodeIcon } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react'
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Card, CardTitle } from '@/components/ui/card';
import { useUserContext } from '@/context/UserContext';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import Avatar from '@/components/Avatar';
import axios from 'axios';

const WS_URL = import.meta.env.VITE_URL_API_WS! || 'http://localhost:5000'

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
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
  const [onlinePeople, setOnlinePeople] = useState<OnlinePeople[]>([])
  const [offlinePeople, setOfflinePeople] = useState<PeopleDB[]>([])
  const [messages, setMessages] = useState<Messages[]>([])
  const [newMsgText, setNewMsgText] = useState<string>('')
  const [ws, setWs] = useState<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)

  const { id, setId, setUsername } = useUserContext()

  useEffect(() => {
    connectToWs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const connectToWs = () => {
    const ws = new WebSocket(WS_URL)
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

  function handleClickEmoji(emoji: { emoji: string }) {
    setNewMsgText(prev => prev + emoji.emoji)
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

      <Card className='flex w-3/12 flex-col'>

        <header className='flex items-center justify-center gap-2 py-2'>
          <CardTitle className='py-1 text-2xl'>MernChat</CardTitle>
          <MessageCircleCodeIcon size={24} />
        </header>

        <Separator />

        <article className='flex flex-col flex-grow gap-2'>

          <div className='overflow-y-auto'>
            {
              onlinePeople.map((person) => (
                <section key={person.userId} className={`flex w-full hover:bg-gray-800 text-gray-200 ${person.userId === selectedPerson ? 'bg-gray-600' : ''}`}>
                  <div className={`w-1.5 rounded-r-md bg-gray-400 ${person.userId === selectedPerson ? 'visible' : 'hidden'}`}></div>
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
                <section key={person._id} className={`flex w-full hover:bg-gray-800 text-gray-200 ${person._id === selectedPerson ? 'bg-gray-600' : ''}`}>
                  <div className={`w-1.5 rounded-r-md bg-gray-400 ${person._id === selectedPerson ? 'visible' : 'hidden'}`}></div>
                  <button onClick={() => setSelectedPerson(person._id)}
                    className='w-full border-gray-100 py-2 flex items-center gap-3 mx-2'>
                    <Avatar online={false} userId={person._id} username={person.username} />
                    <p>{person.username}</p>
                  </button>
                </section>
              ))
            }
          </div>
        </article>

        <Separator />

        <footer className='flex justify-center py-2'>
          <Button onClick={logOut} >
            Log Out
          </Button>
        </footer>

      </Card >

      <Card className='w-9/12'>
        <div className=''>
          {
            !selectedPerson && (
              <div className='flex items-center justify-center h-full'>
                <p className='text-2xl text-gray-400 font-bold'>Select a person to chat with</p>
              </div>
            )
          }
          {
            !!selectedPerson && (
              <div className='overflow-y-auto max-h-[93vh]'>
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
            <form className='flex gap-2 m-2 relative' onSubmit={sendMessage}>
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className='text-white bg-gray-700 hover:bg-gray-800 p-2 rounded-sm'
                type='button'>
                <Smile />
              </button>
              <button className='text-white bg-gray-700 hover:bg-gray-800 p-2 rounded-sm'>
                <Paperclip />
              </button>
              <div className='absolute bottom-12'>
                <EmojiPicker
                  theme={Theme.DARK}
                  open={showEmojiPicker}
                  onEmojiClick={handleClickEmoji}
                />
              </div>
              <Input value={newMsgText} onChange={(e) => setNewMsgText(e.target.value)}
                type='text' placeholder='type your message here' />
              <button className='bg-blue-900 p-2 hover:bg-blue-800 text-white rounded-sm' type='submit'>
                <SendHorizonal />
              </button>
            </form>
          )
        }
      </Card>

    </section >
  )
}