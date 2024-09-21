import { UserContextProvider } from './context/UserContext.tsx'
import { ThemeProvider } from './context/UseTheme.tsx'
import { RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import { Router } from './routes'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <UserContextProvider>
      <RouterProvider router={Router} />
    </UserContextProvider>
  </ThemeProvider>
)
