import { useContext } from 'react'
import { Register } from './Components/Register'
import { UserContext } from './UserContext'
import { Chat } from './components/Chat'

export default function Routes () {
  const { user } = useContext(UserContext)

  if (user) {
    return <Chat />
  }

  return (
    <Register />
  )
}
