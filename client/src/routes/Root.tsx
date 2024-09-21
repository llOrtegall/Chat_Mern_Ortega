import { useUser } from '../context/UserContext'
import RegisterPage from '../pages/RegisterPage'
import { Outlet } from 'react-router-dom'

export default function Root () {
  const { id, username } = useUser()

  if (!id || !username) {
    return <RegisterPage />
  }

  return (
    <div>
      <h1>Root</h1>
      <Outlet />
    </div>
  )
}