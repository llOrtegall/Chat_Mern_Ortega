import { lazy, Suspense } from 'react';
import { useAuth } from '../auth/AuthProvider';

const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));

export const Routes = () => {
  const { user } = useAuth();

  console.log(user);

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