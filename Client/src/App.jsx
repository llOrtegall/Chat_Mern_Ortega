import { UserContextProvider } from './UserContext'
import Routes from './Routes'
import axios from 'axios'

export function App () {
  axios.defaults.baseURL = 'http://localhost:3030'
  axios.defaults.withCredentials = true

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}
