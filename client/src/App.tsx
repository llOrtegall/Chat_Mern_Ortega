import Register from './pages/Register'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3050'
axios.defaults.withCredentials = true

function App() {
  return (
    <Register />
  )
}

export default App
