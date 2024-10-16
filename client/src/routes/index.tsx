import { lazy, Suspense, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import axios from 'axios';
import { User } from '../types/interface';

const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));

const URL_LOGIN = import.meta.env.VITE_URL_LOGIN!;

export const Routes = () => {
  const { user, login } = useAuth();

  useEffect(() => {
    axios.get<User>(`${URL_LOGIN}/profile`)
      .then(res => {
        if(res.status === 200){
          login(res.data)
        }
      })
      .catch(err => console.log(err))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(!user) return (
    <Suspense fallback={<div>Loading ...</div>}>
      <Login />
    </Suspense>
  )

  return(
    <Suspense fallback={<div>Loading ...</div>}>
      <Home />
    </Suspense>
  )
}