import { UserContextProvider } from './UserContext'
import Routes from './Routes'
import axios from 'axios'

export function App () {
  axios.defaults.baseURL = 'http://172.20.1.110:3030'
  axios.defaults.withCredentials = true

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}
