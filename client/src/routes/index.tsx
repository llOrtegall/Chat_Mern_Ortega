import { createBrowserRouter } from 'react-router-dom'
import Root from './Root'

export const Router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />
    }
  ]
)
