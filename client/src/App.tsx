import { useUserContext } from './context/UserContext';
import ChatPage from './pages/ChatPage';
import Register from './pages/Register';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_URL_API;
axios.defaults.withCredentials = true;

function App() {
  const { username, id } = useUserContext()

  if (username && id) {
    return <ChatPage />
  }

  return (
    <Register />
  )
}

export default App
