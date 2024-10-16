import { useEffect, useState } from "react"

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    const webSocket = new WebSocket('ws://192.168.1.3:4000')
    
    setWs(webSocket)

    webSocket.addEventListener('message', handleMessage )
  }, [])

  const handleMessage = (ev: MessageEvent) => {
    console.log(ev);
  }

  return (
    <section className="px-2 py-1">
      <h1>App</h1>
    </section>
  )
}

export default App
