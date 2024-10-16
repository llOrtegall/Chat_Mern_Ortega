import { useEffect, useState } from "react"

const URL_WS = import.meta.env.VITE_URL_WS!;

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    const webSocket = new WebSocket(URL_WS)

    setWs(webSocket)

    webSocket.addEventListener('message', handleMessage )
  }, [])

  const handleMessage = (ev: MessageEvent) => {
    console.log(ev);
  }

  return (
    <section className="px-2 py-1">
      <h1>Home</h1>
    </section>
  )
}