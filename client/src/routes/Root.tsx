import { useUser } from '../context/UserContext'
import LoginPage from '../pages/LoginPage'
// import Chat from '../components/Chat'
import { ChatV2 } from '../components/ChatV2'

export default function Root () {
  const { id, email, } = useUser()

  if (!id || !email) {
    return <LoginPage />
  }

  return <ChatV2 />

  // return <Chat />
}