import { useEffect, useState } from 'react'
import { SendIcon } from './icons/SendIcon'

function Chat () {
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4040')
    setWs(ws)
    ws.addEventListener('message', handleMessages)
  }, [])

  const handleMessages = (event: MessageEvent) => {
    console.log('message', event)
  }

  return (
    <div className="flex h-screen">
      <section className="bg-blue-100 w-1/3">
        contacts
      </section>
      <section className="flex flex-col bg-blue-200 w-2/3 p-2">
        <div className='flex-grow'>
          messages selected person
        </div>
        <form className='flex gap-2'>
          <input type="text" placeholder='type your message here'
            className="bg-white border flex-grow  p-2 rounded-md" />
          <button className="bg-blue-600 p-2 text-white rounded-md">
            <SendIcon />
          </button>
        </form>
      </section>
    </div>
  )
}

export default Chat
