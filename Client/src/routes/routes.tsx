import LoginAndRegisterForm from '../pages/Register'
import { useUser } from '../context/UserContext'
import Chat from '../components/Chat'

function Routes () {
  const { username } = useUser()

  if (username) {
    return <Chat />
  }

  return (
    <>
      <LoginAndRegisterForm />
    </>
  )
}

export default Routes
