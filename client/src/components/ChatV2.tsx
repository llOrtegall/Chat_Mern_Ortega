import { useEffect, useState } from "react"
import { Avatar } from "./ui/Avatar";
import { useUser } from "../context/UserContext";

interface UserData {
  userId: string;
  email: string;
}

interface MsgData {
  online: UserData[];
}

export const ChatV2 = () => {
  const [ws, setWs] = useState<WebSocket | null>(null)

  const { id } = useUser()

  const [onlineUsers, setOnlineUsers] = useState<UserData[]>([])

  const [selectUserId, setSelectUserId] = useState<string | null>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000')
    setWs(ws)

    ws.addEventListener('message', handleMessages)
  }, [])

  const handleMessages = (event: MessageEvent) => {
    const msgData: MsgData = JSON.parse(event.data)
    
    if(msgData.online) {
      showOnlineUsers(msgData.online)
    }
  }

  const showOnlineUsers = (users: UserData[]) => {
    setOnlineUsers(users)
  }

  const onlinePeopleSubtractMe = onlineUsers.filter( user => user.userId !== id)

  return(
    <main className='w-screen h-screen flex'>
      <div className='w-4/12 bg-gray-50'>
        <div className='font-semibold mb-2 text-center text-xl'>MernChat</div>
        {
          onlinePeopleSubtractMe.map( user => (
              <div key={user.userId} onClick={() => setSelectUserId(user.userId)}
                className={`flex items-center gap-2 border-b border-gray-200 py-2 px-2 cursor-pointer ${user.userId === selectUserId ? 'bg-blue-200' : ''}`}>
                { 
                  user.userId === selectUserId && <div className='flex w-1.5 h-8 border border-gray-200 bg-blue-400'></div>
                }
                <Avatar online={true} userId={user.userId} email={user.email}/>
                <p>{user.email.split('@')[0]}</p>
              </div>
            )
          )
        }
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