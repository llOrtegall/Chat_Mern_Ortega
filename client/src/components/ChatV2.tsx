import { useEffect, useState } from "react"

export const ChatV2 = () => {
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000')
    setWs(ws)

    ws.onmessage = (message) => {
      console.log(message.data)
    }
  }, [])

  return(
    <main className='w-screen h-screen flex'>
      <div className='w-4/12 bg-gray-200 p-2'>
        contacts
      </div>
      <div className='w-8/12 bg-blue-200 p-2 flex flex-col'>
        <section className='flex-grow'>
          messages
        </section>
        <form className='flex '>
          <input type='text' className='w-full rounded-md outline-none px-2'/>
          <button className='mx-2 px-2 py-1 bg-green-600 rounded-md font-semibold text-white hover:bg-green-500'>Send</button>
        </form>
      </div>
    </main>
  )
}