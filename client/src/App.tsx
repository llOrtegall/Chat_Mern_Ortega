import { UserContextProvider } from './context/UserContext'
import { URL_API } from './utils/constans'
import Routes from './routes/routes'
import axios from 'axios'

function App () {
  axios.defaults.baseURL = `${URL_API}/`
  axios.defaults.withCredentials = true

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}

export default App
