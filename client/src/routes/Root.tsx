import { useUser } from '../context/UserContext'
import LoginPage from '../pages/LoginPage'
import Chat from '../pages/Chat'

export default function Root () {
  const { id, email, } = useUser()

  if (!id || !email) {
    return <LoginPage />
  }
  return <Chat />
}