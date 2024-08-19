import { UserContextProvider } from './context/UserContext'
import Routes from './routes/routes'
import axios from 'axios'

function App () {
  axios.defaults.baseURL = 'http://192.168.1.6:4040'
  axios.defaults.withCredentials = true

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}

export default App
