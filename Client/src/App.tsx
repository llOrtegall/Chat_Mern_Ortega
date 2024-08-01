import { UserContextProvider } from './context/UserContext'
import axios from 'axios'
import Routes from './routes/routes'

function App () {
  axios.defaults.baseURL = 'http://localhost:4040'
  axios.defaults.withCredentials = true

  return (
    <>
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </>
  )
}

export default App
