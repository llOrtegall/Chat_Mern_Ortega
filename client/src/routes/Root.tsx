import { useUser } from '../context/UserContext'
import LoginPage from '../pages/LoginPage'
import { Outlet } from 'react-router-dom'

export default function Root () {
  const { id, username } = useUser()

  if (!id || !username) {
    return <LoginPage />
  }

  return (
    <div>
      <h1>Root</h1>
      <Outlet />
    </div>
  )
}