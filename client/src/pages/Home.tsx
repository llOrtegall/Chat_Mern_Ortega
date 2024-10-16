import { useEffect, useState } from "react"

const URL_WS = import.meta.env.VITE_URL_WS!;

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null)

  console.log(ws);

  useEffect(() => {
    const webSocket = new WebSocket(URL_WS)

    setWs(webSocket)

    webSocket.addEventListener('message', handleMessage )
  }, [])

  const handleMessage = (ev: MessageEvent) => {
    console.log(ev);
  }

  return (
    <section className='flex w-full h-screen'>
      <aside className='w-3/12 bg-blue-100'>
        <h2>Users</h2>
      </aside>
      <main className='w-9/12 bg-blue-300'>
        <h1>Chats</h1>
      </main>
    </section>
  )
}