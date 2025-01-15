import { Smile, Paperclip, SendHorizonal } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react'
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useUserContext } from '@/context/UserContext';
import { OnlinePeople } from '@/types/interfaces';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { NavBar } from '@/components/NavBar';
import { Card } from '@/components/ui/card';
import axios from 'axios';

const WS_URL = import.meta.env.VITE_URL_API_WS! || 'http://localhost:5000'

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
  const [messages, setMessages] = useState<Messages[]>([])
  const [newMsgText, setNewMsgText] = useState<string>('')
  const [ws, setWs] = useState<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)

  const { id } = useUserContext()

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

    if (!selectedPerson) return
    if (!newMsgText) return

    setShowEmojiPicker(false)

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


  function handleClickEmoji(emoji: { emoji: string }) {
    setNewMsgText(prev => prev + emoji.emoji)
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

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

      <NavBar people={onlinePeople} funSelect={setSelectedPerson} selected={selectedPerson} />

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
              <div className='overflow-y-auto h-[94vh] lg:h-[90vh] xl:h-[92vh] 2xl:h-[93vh] px-20'>
                <div className='flex flex-col gap-2 p-2 pb-2'>
                  {
                    messages.map((msg) => (
                      <div key={msg._id} className={`flex flex-col gap-1 ${msg.sender === id ? 'items-end' : 'items-start'}`}>
                        <div className={`p-2 rounded-md ${msg.sender === id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
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
              <Button variant={'secondary'}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile />
              </Button>
              <Button variant={'secondary'}>
                <Paperclip />
              </Button>
              <div className='absolute bottom-12'>
                <EmojiPicker
                  theme={Theme.LIGHT}
                  open={showEmojiPicker}
                  onEmojiClick={handleClickEmoji}
                />
              </div>
              <Input value={newMsgText} onChange={(e) => setNewMsgText(e.target.value)}
                type='text' placeholder='type your message here' />
              <Button variant={'secondary'}
                type='submit'>
                <SendHorizonal />
              </Button>
            </form>
          )
        }
      </Card>

    </section >
  )
}