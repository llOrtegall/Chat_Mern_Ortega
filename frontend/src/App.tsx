import { useEffect } from "react"

const WS_URL = "ws://localhost:4000"

function App() {

  useEffect(() => {
    const socket = new WebSocket(WS_URL)

    socket.addEventListener("open", (ev: Event) => {
      socket.send("soy ortega")
      console.log(ev);
    })
    socket.addEventListener("message", (ev: MessageEvent) => {
      console.log(ev.data);
    })
  }, [])

  return (
    <div>
      test
    </div>
  )
}

export default App
