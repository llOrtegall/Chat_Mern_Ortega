import { AuthProvider } from './auth/AuthProvider'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Routes } from './routes'

import './index.css'
import axios from 'axios'

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </StrictMode>,
)
