import { createBrowserRouter } from 'react-router-dom'
import RegisterPage from '../pages/RegisterPage'
import Root from './Root'

export const Router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />
    },
    {
      path: '/register',
      element: <RegisterPage />
    }
    
  ]
)
