import { useEffect } from "react"
const WS_URL = "ws://localhost:4000"

export default function HomePage() {

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
    <>
      <div>Home Page</div>
    </>
  )
}