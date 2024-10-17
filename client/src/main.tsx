import { AuthProvider } from './auth/AuthProvider'
import { createRoot } from 'react-dom/client'
import { Routes } from './routes'

import './index.css'
import axios from 'axios'

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <Routes />
  </AuthProvider>
)
