import LoginAndRegisterForm from '../pages/Register'
import { useUser } from '../context/UserContext'

function Routes () {
  const { id, username } = useUser()

  if (username) {
    return 'Welcome ' + username + '!' + 'Your id is: ' + id
  }

  return (
    <>
      <LoginAndRegisterForm />
    </>
  )
}

export default Routes
