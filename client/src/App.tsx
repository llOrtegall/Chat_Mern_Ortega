import { SkeletonRegister } from '@/components/SkeletonRegister';
import { useUserContext } from '@/context/UserContext';
import { Suspense } from 'react';
import { lazy } from 'react';
import axios from 'axios';

const ChatPage = lazy(() => import('@/pages/ChatPage'));
const Register = lazy(() => import('@/pages/Register'));

axios.defaults.baseURL = import.meta.env.VITE_URL_API;
axios.defaults.withCredentials = true;

function App() {
  const { username, id } = useUserContext()

  if (username && id) {
    return (
      <Suspense fallback={<div>loading ...</div>}>
        <ChatPage />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<SkeletonRegister />}>
      <Register />
    </Suspense>
  )
}

export default App
