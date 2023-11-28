import { useContext } from 'react'
import { Register } from './Components/Register'
import { UserContext } from './UserContext'

export default function Routes () {
  const { user } = useContext(UserContext)
  console.log(user)

  if (user) {
    return 'loggeed in'
  }

  return (
    <Register />
  )
}
