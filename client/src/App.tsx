import { useUserContext } from './context/UserContext'
import Register from './pages/Register'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3050'
axios.defaults.withCredentials = true

function App() {
  const { username, id } = useUserContext()

  if (username && id) {
    return (
      <div>
        <h1>Welcome {username}</h1>
      </div>
    )
  }

  return (
    <Register />
  )
}

export default App
