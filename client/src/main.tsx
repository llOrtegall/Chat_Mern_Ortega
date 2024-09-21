import { UserContextProvider } from './context/UserContext.tsx'
import { ThemeProvider } from './context/UseTheme.tsx'
import { RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { URL_API } from './utils/constans.ts'
import { Router } from './routes'
import axios from 'axios'
import './index.css'

axios.defaults.withCredentials = true
axios.defaults.baseURL = `${URL_API}`

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <UserContextProvider>
      <RouterProvider router={Router} />
    </UserContextProvider>
  </ThemeProvider>

)
