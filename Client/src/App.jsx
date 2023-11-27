import { UserContextProvider } from './UserContext'
import Routes from './Routes'
import axios from 'axios'

export function App () {
  axios.defaults.baseURL = 'http://localhost:4040'
  axios.defaults.withCredentials = true

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}
